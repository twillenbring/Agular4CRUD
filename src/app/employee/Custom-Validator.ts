import {AbstractControl, ValidatorFn, FormGroup} from '@angular/forms'

export function EmailDomainValidator(domainName: string): ValidatorFn {
    //returns key/value pair: key as string and value as a boolean only if validation fails
    // if validation passes it returns null 

    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const email: string = control.value;
        const domain = email?.substring(email?.lastIndexOf('@') + 1);

        if (email === '' || domain?.toLowerCase() === domainName) {
            return null;
        } else {
            return { 'emailDomain': true };
        }

    };
}

export function ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if(matchingControl?.errors && !matchingControl?.errors.confirmedValidator){
            return;
        }
        if(control?.value !== matchingControl?.value){
            matchingControl?.setErrors({confirmedValidator: true});
        } else {
            matchingControl?.setErrors(null);
        }
    }
}

export function matchEmails(group: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const emailControl = group.get('email');
        const confirmEmailControl = group.get('confirmEmail');

        if (emailControl?.value === confirmEmailControl?.value || confirmEmailControl?.pristine) {
            return null;
        } else {
            return { 'emailMismatch': true };
        }
    }
}