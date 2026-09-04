export class CreateProfileDto {
  handle: string;
  displayName?: string;
  contactType: 'email' | 'phone' | 'oauth';
  contactValue: string;
}
