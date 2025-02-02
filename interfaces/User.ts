export default interface User {
  uuid: string|null,
  first_name: string;
  last_name: string,
  grade: number | null,
  has_advisor: boolean|null,
  state: Uuid,
  phone_number: string,
  city: Uuid,
  field: Uuid | null,
  gender: string,
  role: string
}

interface Uuid {
  name: string,
  uuid: string
}