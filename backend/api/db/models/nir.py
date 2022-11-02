def nir_format(field: str):
    if field:
        nir = field.strip()
        if len(nir) != 15:
            return "The NIR must be 15 digits long"
        if not all([char.isdigit() for char in nir]):
            return "The NIR cannot contain letters"
        payload = int(nir[:13])
        check = int(nir[13:])
        valid = 97 - payload % 97 == check
        if not valid:
            return "The provided NIR is not valid"
