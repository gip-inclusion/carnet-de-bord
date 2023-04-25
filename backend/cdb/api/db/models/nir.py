def nir_format(field: str):
    if field:
        nir = field.strip()
        if len(nir) != 15 and len(nir) != 13:
            return "The NIR must be 13 or 15 (with control key) digits long"
        if not all([char.isdigit() or char == "A" or char == "B" for char in nir]):
            return "The NIR cannot contain letters"
        # https://fr.wikipedia.org/wiki/Num%C3%A9ro_de_s%C3%A9curit%C3%A9_sociale_en_France#cite_note-F
        nir = nir.replace("2A", "19").replace("2B", "18")
        payload = int(nir[:13])

        # Run control key validation only if we have it
        if len(nir) == 15:
            check = int(nir[13:])
            valid = 97 - payload % 97 == check
            if not valid:
                return "The provided NIR is not valid"
