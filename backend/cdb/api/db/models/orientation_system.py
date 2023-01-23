from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from cdb.api.db.models.orientation_type import OrientationType


class OrientationSystem(BaseModel):
    id: UUID
    name: str
    orientation_type: OrientationType
    created_at: datetime
    updated_at: datetime

    def get_label(self):
        orientation_type_label = None

        if self.orientation_type == "pro":
            orientation_type_label = "Pro"
        elif self.orientation_type == "social":
            orientation_type_label = "Social"
        elif self.orientation_type == "sociopro":
            orientation_type_label = "Socio-pro"

        if orientation_type_label == self.name:
            return orientation_type_label
        else:
            return f"{self.name} ({orientation_type_label})"
