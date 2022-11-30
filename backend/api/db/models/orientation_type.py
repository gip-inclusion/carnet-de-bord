from strenum import StrEnum


class OrientationType(StrEnum):
    pro = "pro"
    social = "social"
    sociopro = "sociopro"

    def get_label(self):
        if self.value == "pro":
            return "Professionnel"
        elif self.value == "social":
            return "Social"
        elif self.value == "sociopro":
            return "Socio-professionnel"
