import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css',
})

export class EditTrip implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripData,
  ) {}

  ngOnInit(): void {
    // Retrieve stashed trip ID
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['travel']);
      return;
    }

    console.log('EditTripComponent::ngOnInit');
    console.log('tripcode:' + tripCode);

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    })

    this.tripService.getTrips(tripCode)
      .subscribe({
        next: (value: any) => {
          if (!value || !value[0]) {
            this.message = 'No Trip Retrieved!';
            console.log(this.message);
            return;
          }
          this.trip = value[0];
          // Populate our record into the form
          // Date inputs only accept yyyy-MM-dd so trim the ISO timestamp
          this.editForm.patchValue({
            ...value[0],
            start: String(value[0].start).split('T')[0],
          });
          this.message = 'Trip: ' + tripCode + ' retrieved';
          console.log(this.message);
        },
          error: (error: any) => {
            console.log('Error: ' + error);
          }
      })
  }

  public onSubmit() {
    this.submitted = true;
    if (this.editForm.valid) {
      this.tripService.updateTrip(this.editForm.value)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigate(['travel']);
          },
          error: (error: any) => {
            console.log('Error: ' + error);
          }});
    }
  }

  get f() {
    return this.editForm.controls;
  }
}