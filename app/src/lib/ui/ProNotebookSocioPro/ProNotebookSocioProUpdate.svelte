<script lang="ts">
	import { educationLevelKeys, workSituationKeys } from '$lib/constants/keys';
	import type {
		ContractTypeEnum,
		EmploymentTypeEnum,
		UpdateSocioProContractTypeEnum,
		UpdateSocioProEmploymentTypeEnum,
		GetNotebookQuery,
		ProfessionalProjectInsertInput,
		UpdateSocioProProfessionalProjectSetInput,
		UpdateSocioProProfessionalProjectInsertInput,
	} from '$lib/graphql/_gen/typed-document-nodes';
	import { UpdateSocioProDocument } from '$lib/graphql/_gen/typed-document-nodes';
	import { trackEvent } from '$lib/tracking/matomo';
	import { mutation, operationStore } from '@urql/svelte';
	import { Alert, Button } from '../base';
	import { add } from 'date-fns';
	import { formatDateISO } from '$lib/utils/date';
	import {
		type ProNotebookSocioproInput,
		proNotebookSocioproSchema,
	} from './ProNotebookSocioPro.schema';
	import { Checkbox, Form, Input, Select } from '$lib/ui/forms';
	import { captureException } from '$lib/utils/sentry';
	import {
		Elm as DiagnosticEditElm,
		type ProfessionalProjectOut,
	} from '$elm/DiagnosticEdit/Main.elm';
	import type { GraphQLError } from 'graphql';
	import { onMount } from 'svelte';
	import { sticky } from '$lib/actions/sticky';
	export let onClose: () => void;
	export let notebook: Pick<
		GetNotebookQuery['notebook_public_view'][0]['notebook'],
		| 'id'
		| 'workSituation'
		| 'workSituationDate'
		| 'workSituationEndDate'
		| 'rightRqth'
		| 'educationLevel'
		| 'lastJobEndedAt'
		| 'focuses'
		| 'situations'
		| 'professionalProjects'
	>;
	export let refSituations: GetNotebookQuery['refSituations'];

	type NotebookProfessionalProject =
		GetNotebookQuery['notebook_public_view'][number]['notebook']['professionalProjects'][number];

	let stuck = true;
	const stickToTop = false;
	function handleStuck(e: CustomEvent<{ isStuck: boolean }>) {
		stuck = e.detail.isStuck;
	}

	$: errorMessage = '';
	let selectedSituations: string[] = notebook.situations.map(({ refSituation }) => refSituation.id);
	type ProfessionalProject = Pick<
		ProfessionalProjectInsertInput,
		'id' | 'mobilityRadius' | 'contractTypeId' | 'romeCodeId' | 'hourlyRate' | 'employmentTypeId'
	>;
	let professionalProjects: ProfessionalProject[] =
		notebook?.professionalProjects?.map((professionalProject) => {
			return {
				id: professionalProject.id,
				mobilityRadius: professionalProject.mobilityRadius,
				romeCodeId: professionalProject.rome_code?.id,
				hourlyRate: professionalProject.hourlyRate,
				employmentTypeId: professionalProject?.employment_type?.id as EmploymentTypeEnum,
				contractTypeId: professionalProject?.contract_type?.id as ContractTypeEnum,
			};
		}) ?? [];

	const updateSocioProStore = operationStore(UpdateSocioProDocument, null, {
		additionalTypenames: ['professional_project', 'notebook', 'notebook_situation'],
	});
	const updateSocioPro = mutation(updateSocioProStore);

	const initialValues = {
		workSituation: notebook.workSituation,
		workSituationDate: notebook.workSituationDate ?? '',
		workSituationEndDate: notebook.workSituationEndDate ?? '',
		rightRqth: notebook.rightRqth,
		educationLevel: notebook.educationLevel,
		lastJobEndedAt: notebook.lastJobEndedAt ?? '',
	};

	function close() {
		onClose();
	}

	function professionalProjectIsModified(professionalProject: ProfessionalProject): boolean {
		const currentProfessionalProject = notebook.professionalProjects.find(
			({ id }) => id === professionalProject.id
		);

		if (!currentProfessionalProject) {
			return true;
		}

		return !areEqualsProfessionalProjects(
			toProfessionalProject(currentProfessionalProject),
			professionalProject
		);
	}

	function areEqualsProfessionalProjects(
		lhs: ProfessionalProject,
		rhs: ProfessionalProject
	): boolean {
		return (
			// null and undefined are considered equal
			lhs.contractTypeId == rhs.contractTypeId &&
			lhs.employmentTypeId == rhs.employmentTypeId &&
			lhs.romeCodeId == rhs.romeCodeId &&
			lhs.hourlyRate == rhs.hourlyRate &&
			lhs.mobilityRadius == rhs.mobilityRadius
		);
	}

	function toProfessionalProject(
		notebookProfessionalProject: NotebookProfessionalProject
	): ProfessionalProject {
		return {
			contractTypeId: (notebookProfessionalProject.contract_type?.id ?? null) as ContractTypeEnum,
			employmentTypeId: (notebookProfessionalProject.employment_type?.id ??
				null) as EmploymentTypeEnum,
			romeCodeId: notebookProfessionalProject.rome_code?.id ?? null,
			hourlyRate: notebookProfessionalProject.hourlyRate,
			mobilityRadius: notebookProfessionalProject.mobilityRadius,
		};
	}

	async function handleSubmit(values: ProNotebookSocioproInput) {
		trackEvent('pro', 'notebook', 'update socio pro info');
		const { educationLevel, rightRqth, workSituation } =
			proNotebookSocioproSchema.validateSync(values);
		const currentSituationIds = notebook.situations.map(({ refSituation }) => refSituation.id);

		const situationsToAdd = selectedSituations
			.filter((id) => !currentSituationIds.includes(id))
			.map((situationId) => {
				return {
					notebookId: notebook.id,
					situationId,
				};
			});

		const situationIdsToDelete = currentSituationIds.filter(
			(id) => !selectedSituations.includes(id)
		);

		const professionalProjectIds = professionalProjects.map(({ id }) => id);
		const professionalProjectIdsToDelete = notebook.professionalProjects
			.map(({ id }) => id)
			.filter((id) => !professionalProjectIds.includes(id));

		const professionalProjectsToAdd: UpdateSocioProProfessionalProjectInsertInput[] =
			professionalProjects
				.filter(({ id }) => !id)
				.map((project) => {
					return {
						notebookId: notebook.id,
						romeCodeId: project.romeCodeId,
						hourlyRate: project.hourlyRate,
						mobilityRadius: project.mobilityRadius,
						contractTypeId: project.contractTypeId as unknown as UpdateSocioProContractTypeEnum,
						employmentTypeId:
							project.employmentTypeId as unknown as UpdateSocioProEmploymentTypeEnum,
					};
				});

		const professionalProjectsToUpdate: UpdateSocioProProfessionalProjectSetInput[] =
			professionalProjects
				.filter(({ id }) => id)
				.filter(professionalProjectIsModified)
				.map((project) => {
					return {
						id: project.id,
						mobilityRadius: project.mobilityRadius,
						romeCodeId: project.romeCodeId,
						contractTypeId: project.contractTypeId as unknown as UpdateSocioProContractTypeEnum,
						employmentTypeId:
							project.employmentTypeId as unknown as UpdateSocioProEmploymentTypeEnum,
						hourlyRate: project.hourlyRate,
					};
				});

		const payload = {
			id: notebook.id,
			educationLevel,
			rightRqth,
			workSituation,
			workSituationDate: values.workSituationDate.toString() || null,
			workSituationEndDate: values.workSituationEndDate.toString() || null,
			lastJobEndedAt: values.lastJobEndedAt.toString() || null,
			professionalProjectsToAdd,
			professionalProjectIdsToDelete,
			professionalProjectsToUpdate,
			situationsToAdd,
			situationIdsToDelete,
		};

		errorMessage = null;
		await updateSocioPro(payload);
		if ($updateSocioProStore.error) {
			errorMessage = formatErrors($updateSocioProStore.error.graphQLErrors);
		} else {
			close();
		}
	}

	function formatErrors(errors: GraphQLError[]): string {
		return errors
			.map((error) => {
				if (/hourly-rate-gt-zero/.test(error.message)) {
					return "Il n'est pas possible de saisir un salaire horaire inférieur ou égal à 0.";
				}
				if (/mobility-radius-ge-zero/.test(error.message)) {
					return "Il n'est pas possible de saisir une zone de mobilité négative.";
				}
				if (/notebook_id_rome_code_id_null_idx/.test(error.message)) {
					return "Il n'est pas possible de saisir un salaire horaire inférieur ou égal à 0.";
				}
				if (/mobility-radius-ge-zero/.test(error.message)) {
					return "Il n'est pas possible de saisir une zone de mobilité négative.";
				}
				if (/notebook_id_rome_code_id_null_idx/.test(error.message)) {
					return "Il n'est pas possible de créer deux projets professionnels pour le même emploi ni plusieurs projets professionnels en construction.";
				}
				return error.message;
			})
			.join('\n');
	}

	function setWorkSituationEndDate(initialDate: unknown, monthInterval: number) {
		if (
			typeof initialDate !== 'string' &&
			typeof initialDate !== 'number' &&
			!(initialDate instanceof Date)
		) {
			captureException(
				new Error(
					`[setWorkSituationEndDate] Une date était attendue mais la sélection reçue est ${JSON.stringify(
						initialDate
					)}.`
				)
			);
			return initialDate;
		}
		if (monthInterval) {
			return formatDateISO(add(new Date(initialDate), { months: monthInterval }));
		}
		return initialDate;
	}

	let elmNode: HTMLElement;

	onMount(() => {
		if (!elmNode || !elmNode.parentNode) return;

		const app = DiagnosticEditElm.DiagnosticEdit.Main.init({
			node: elmNode,
			flags: {
				refSituations,
				situations: notebook.situations,
				professionalProjects: notebook.professionalProjects.map(
					({
						id,
						createdAt,
						updatedAt,
						mobilityRadius,
						rome_code,
						hourlyRate,
						employment_type,
						contract_type,
						updater,
					}) => ({
						id,
						createdAt,
						updatedAt,
						mobilityRadius,
						rome: rome_code,
						hourlyRate,
						contractType: contract_type,
						employmentType: employment_type,
						updater,
					})
				),
			},
		});

		app.ports.sendSelectedSituations.subscribe((updatedSelection: string[]) => {
			selectedSituations = updatedSelection;
		});

		app.ports.sendUpdatedProfessionalProjects.subscribe(
			(updatedProfessionalProjects: ProfessionalProjectOut[]) => {
				professionalProjects = updatedProfessionalProjects;
			}
		);
	});
</script>

<section class="flex flex-col w-full">
	<h1 class="text-vert-cdb">Diagnostic socioprofessionnel</h1>
	<Form
		{initialValues}
		validationSchema={proNotebookSocioproSchema}
		onSubmit={handleSubmit}
		let:form
		let:updateValidateField
		let:isSubmitted
		let:isSubmitting
		let:isValid
	>
		<h2 class="text-vert-cdb">Situation professionnelle</h2>
		<div class="fr-form-group">
			<Select
				name="workSituation"
				selectLabel={'Situation actuelle'}
				selectHint={'Sélectionnez votre situation actuelle...'}
				options={workSituationKeys.options}
			/>
			<div class="row-auto">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<Input class="mb-0" name="workSituationDate" inputLabel="Depuis le" type="date" />
					</div>
					<div>
						<Input
							id="work-situation-end-date"
							class="mb-0"
							name="workSituationEndDate"
							inputLabel="Jusqu'au"
							type="date"
						/>
						<div class="col-end-3 italic text-xs mt-1 text-vert-cdb-500">
							<span>Durée : </span>
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la fin de la situation dans 3 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField(
										'workSituationEndDate',
										setWorkSituationEndDate(form.workSituationDate, 3)
									);
								}}>3 mois</button
							>
							-
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la fin de la situation dans 6 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField(
										'workSituationEndDate',
										setWorkSituationEndDate(form.workSituationDate, 6)
									);
								}}>6 mois</button
							>
							-
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la fin de la situation dans 12 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField(
										'workSituationEndDate',
										setWorkSituationEndDate(form.workSituationDate, 12)
									);
								}}>12 mois</button
							>
							-
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la fin de la situation dans 24 mois"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField(
										'workSituationEndDate',
										setWorkSituationEndDate(form.workSituationDate, 24)
									);
								}}>24 mois</button
							>
							-
							<button
								aria-controls="work-situation-end-date"
								aria-label="Définir la durée comme étant indéterminée"
								type="button"
								class="cursor-pointer underline"
								on:click={() => {
									updateValidateField('workSituationEndDate', '');
								}}>indéterminée</button
							>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="fr-form-group">
			<Input name="lastJobEndedAt" inputLabel="Date de fin du dernier emploi" type="date" />
		</div>
		<div class="pb-4">
			<Checkbox name="rightRqth" label="RQTH" />
		</div>

		<div class="fr-form-group">
			<div class="pb-2 font-bold">Niveau de formation</div>
			<Select
				name="educationLevel"
				selectLabel={"Niveau d'étude le plus élevé"}
				options={educationLevelKeys.options}
			/>
		</div>

		{#key refSituations}
			<div class="elm-node">
				<!-- Elm app needs to be wrapped by a div to avoid navigation exceptions when unmounting -->
				<div bind:this={elmNode} />
			</div>
		{/key}

		<div
			class="flex flex-row gap-6 pt-4 pb-4 bg-white sticky bottom-0"
			use:sticky={{ stickToTop }}
			on:stuck={handleStuck}
			class:bottom-banner-container={stuck}
		>
			<div class:bottom-banner={stuck} class:fr-container={stuck}>
				{#if errorMessage}
					<div class="mb-4">
						<Alert
							type="error"
							title={"Impossible d'enregistrer les modifications."}
							description={errorMessage}
						/>
					</div>
				{/if}
				<Button type="submit" disabled={isSubmitting || (isSubmitted && !isValid)}
					>Enregistrer le diagnostic</Button
				>
				<Button outline on:click={close}>Annuler</Button>
			</div>
		</div>
	</Form>
</section>

<style>
	/* this rule overrides the tailwind box shadow that mimic the outline on focus */
	:global(.elm-select input[type='text']) {
		box-shadow: none;
	}
	.bottom-banner-container {
		position: fixed !important;
		left: 0;
		right: 0;
		box-shadow: 1px 1px 4px;
		padding-left: 0px;
	}

	.bottom-banner-container > .fr-container {
		padding-left: 8px;
	}

	:global(.elm-node button, .elm-node input) {
		scroll-margin-bottom: 6rem;
		scroll-margin-top: 2rem;
	}
</style>
