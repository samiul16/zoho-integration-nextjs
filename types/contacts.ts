// types/contacts.ts
export default interface Contact {
  id: string;
  First_Name: string;
  Last_Name: string;
  Email: string;
  Account_Name:
    | {
        name: string;
        id: string;
      }
    | string; // Sometimes it might be a string if not linked
  Phone: string;
}
