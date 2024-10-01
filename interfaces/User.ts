export default interface User {
  first_name: string;
  last_name: string,
  grade: number,
  has_advisor: boolean,
  state: Uuid,
  phone_number: string,
  city: Uuid,
  field: Uuid,
  gender: string
}

interface Uuid {
  name: string,
  uuid: string
}