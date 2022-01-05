import { Component, OnInit } from '@angular/core';
// Import FormGroup and FormControl classes
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EmailDomainValidator, ConfirmedValidator} from './Custom-Validator'
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { ISkill } from './ISkill';
import { Router } from '@angular/router'

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  // This FormGroup contains fullName and Email form controls
  employeeForm!: FormGroup;
  employee!: IEmployee;
  pageTitle!: string;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router) { }


  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      fullName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: [null, [Validators.required, Validators.email, EmailDomainValidator('dell.com')]],
        confirmEmail: [null, Validators.required],
      }, {validator: ConfirmedValidator('email', 'confirmEmail')}),
      phone: [null],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });

    this.route.paramMap.subscribe(params =>{
      const empId = params.get('id');
      if(empId){
        this.pageTitle = 'Edit Employee';
        this.getEmployee(+empId);
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: 0,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });


    this.employeeForm.get('contactPreference')?.valueChanges.subscribe((data: string) => {
        this.onContactPrefernceChange(data);
      });

    // Subscribe to valueChanges observable
    this.employeeForm.get('fullName')?.valueChanges.subscribe(
      value => {
        console.log(value);
      }
    );
  }

  getEmployee(id: number) {
    this.employeeService.getEmployee(id)
      .subscribe(
        (employee: IEmployee) => {
          this.editEmployee(employee);
          this.employee = employee;
        },
        (err: any) => console.log(err)
      );
  }
  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });
    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }

  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));
    });

    return formArray;
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: [null, Validators.required],
      experienceInYears: [null, Validators.required],
      proficiency: [null, Validators.required]
    });
  }

  deleteSkill(i: number) {
    const skillsFormArray = this.skillsArray;
    skillsFormArray.removeAt(i);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAllAsTouched();
  }

  get email(){
    return this.employeeForm.get('emailGroup.email');
  }
  get confirmEmail(){
    return this.employeeForm.get('emailGroup.confirmEmail');
  }

  get skillsArray() {
    return this.employeeForm.get('skills') as FormArray;
  }

  get skillName(){
    return this.employeeForm.get('skills.skillName');

  }

  get experienceYear(){
    return this.employeeForm.get('skills.experienceInYears');
  }

  get proficiency(){
    return this.employeeForm.get('skills.proficiency');
  }


  // If the Selected Radio Button value is "phone", then add the
  // required validator function otherwise remove it
  onContactPrefernceChange(selectedValue: string) {
    const phoneFormControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneFormControl?.setValidators(Validators.required);
    } else {
      phoneFormControl?.clearValidators();
    }
    phoneFormControl?.updateValueAndValidity();
  }


  logKeyValuePairs(group: FormGroup): void {
    // loop through each key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get a reference to the control using the FormGroup.get() method
      const abstractControl = group.get(key);
      // If the control is an instance of FormGroup i.e a nested FormGroup
      // then recursively call this same method (logKeyValuePairs) passing it
      // the FormGroup so we can get to the form controls in it
      if (abstractControl instanceof FormGroup) {
        this.logKeyValuePairs(abstractControl);
        // If the control is not a FormGroup then we know it's a FormControl
      } else {
        console.log('Key = ' + key + ' && Value = ' + abstractControl?.value);
      }
    });
  }
  onLoadDataClick(): void {
    this.logKeyValuePairs(this.employeeForm);
  }
  onSubmit(): void {
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees']),
        (err: any) => console.log(err)
      );
    } else {
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees']),
        (err: any) => console.log(err)
      );
    }
    //console.log(this.employeeForm);
  }
  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

}
/**
 * hard coded email domain function
 * NOT USED
function emailDomain(control: AbstractControl): { [key: string]: any } | null {
  const email: string = control.value;
  const domain = email.substring(email.lastIndexOf('@') + 1);
  if (email === '' || domain.toLowerCase() === 'gmail.com') {
    return null;
  } else {
    return { 'emailDomain': true };
  }
}
*/


