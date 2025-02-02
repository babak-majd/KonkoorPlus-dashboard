export default interface User {
  first_name: string;
  last_name: string,
  img: string;
  email: {
    value: string;
    ok: boolean;
  };
  mobile: {
    value: string;
    ok: boolean;
  };
  lang: string;
}
