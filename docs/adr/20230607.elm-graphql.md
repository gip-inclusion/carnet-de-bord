---
status: Draft
date: 2023-06-07
deciders:
---

# Graphql in Elm

## Context and Problem Statement

The app is behind written in [Elm](https://elm-lang.org). The backend is accessed through [Hasura](https://hasura.io) with its graphql API.
Thus, we need to call graphql from the Elm code (instead of svelte).

## Decision Drivers

**TODO**

- Desire to divide the overall system into manageable parts to reduce complexity
- Ability to exchange system parts without affecting others

## Decision Outcome

**TODO**
We decided to apply the Layers pattern and neglected other decomposition pattern such as pipes-and-filters or workflow because the system under construction and its capabilities do not suggest an organization by data flow or control flow. Technology is expected to be primary driver of change during system evolution.

### Consequences

**TODO**

- Good, because the Layers pattern provides high flexibility regarding technology selections within the layers (changeability) and enables teams to work on system parts in parallel.
- Bad, because there might be a performance penalty for each level of indirection and some undesired replication of implementation artifacts.

## Considered solutions

### Delegate to svelte

When we need to do a graphql call, we send the data to svelte via a port. Svelte then translates the data into a graphql query. When it gets the response, it sends the data to Elm via another port (and matching subscription). Elm then has to map the data to its internal model.

#### Pros

- Svelte can guarantee the type safety of the query at compile time.
- Elm stays relatively simple and fast.

#### Cons

- The flow of data is harder to follow since it jumps in and out of Elm.
- A lot of mapping code from the Elm model to svelte and back.

### String and Json.Decode

We write the graphql in a multiline string as an http body. Then we use json decoders to parse the response.

#### Pros

- Lightweight
- Simple to read and follow the flow of data

#### Cons

- We have no autocompletion for the graphql and no syntax highlighting.
- If the schema changes we only know at runtime. So we should have integration tests to ensure the graphql is still valid before going to production.

### [graphql-to-elm](https://package.elm-lang.org/packages/harmboschloo/graphql-to-elm/latest/)

It is an elm module and code generator. It translates a graphql file into the Http call and Json.Decode.Decoder.

It simplifies writing code but does not provide additional guarantees.

### [elm-graphql](https://package.elm-lang.org/packages/dillonkearns/elm-graphql/latest/)

It is an elm package and code generator.
It translates the graphql schema into elm code. Thus making invalid graphql queries impossible at compile time.

#### Pros

Type safe graphql. The feedback loop is as short as possible

The graphql schema is translated into type safe Elm.

- It's technically impossible to write a query that would not be valid against the schema.
- Any structural change to the schema would prevent the elm code from compiling.

#### Cons

- The generated code is very big. This makes elm-review and elm-language-server a lot slower.
  - 450 files
  - 48 398 lines of Elm
- Some of the code is quite awkward to work with

```graphql
query {
	notebook_situation(where: { notebookId: { _eq: "9b07a45e-2c7c-4f92-ae6b-bc2f5a3c9a7d" } }) {
		creator {
			orientation_manager {
				lastname
				firstname
			}
			professional {
				structure {
					name
				}
				lastname
				firstname
			}
		}
		createdAt
		refSituation {
			description
			theme
		}
	}
}
```

Translates into 100 lines of Elm. And in particular the where clause is very hard to write and read

```elm
findBy :
    String
    -> CdbGQL.Query.NotebookSituationOptionalArguments
    -> CdbGQL.Query.NotebookSituationOptionalArguments
findBy id args =
    { args | where_ = Present (notebookIdEq id) }


notebookIdEq : String -> CdbGQL.InputObject.Notebook_situation_bool_exp
notebookIdEq notebookId =
    buildNotebook_situation_bool_exp
        (\args ->
            { args | notebookId = Present (eq notebookId) }
        )


eq : String -> CdbGQL.InputObject.Uuid_comparison_exp
eq notebookId =
    buildUuid_comparison_exp
        (\comparison ->
            { comparison | eq_ = Present <| CdbGQL.Scalar.Uuid notebookId }
        )

```
