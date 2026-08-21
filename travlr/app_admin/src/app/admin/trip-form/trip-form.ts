import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Trip } from '../../models/trip';
import { TripData } from '../../services/trip-data';

// Image files under public/assets/images that suit trip cards
export const TRIP_IMAGES: string[] = [
  'reef1.jpg', 'reef2.jpg', 'reef3.jpg', 'kayak.jpg', 'dive-site.png',
  'sea-sound.jpg', 'first-class.jpg', 'deluxe.jpg', 'suite.jpg', 'rooms.png',
  'buffet.jpg', 'seafoods.jpg', 'desserts.jpg',
];

const LENGTH_PATTERN = /(\d+)\s*nights?\s*\/\s*(\d+)\s*days?/i;

// Shared add and edit form for trips. Edit mode is selected when the
// route carries a tripCode parameter
@Component({
  selector: 'app-trip-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './trip-form.html',
  styleUrl: './trip-form.css',
})
export class TripForm implements OnInit {
  form!: FormGroup;
  originalCode: string | null = null;
  submitted = false;
  saving = false;
  formError = '';
  images = TRIP_IMAGES;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tripDataService: TripData,
  ) {}

  get isEdit(): boolean {
    return this.originalCode !== null;
  }

  get f() {
    return this.form.controls;
  }

  get lengthGroup(): FormGroup {
    return this.form.get('length') as FormGroup;
  }

  ngOnInit(): void {
    this.originalCode = this.route.snapshot.paramMap.get('tripCode');

    this.form = this.formBuilder.group({
      _id: [null],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: this.formBuilder.group({
        nights: [0, [Validators.required, Validators.min(0)]],
        days: [0, [Validators.required, Validators.min(0)]],
      }),
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: [null, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });

    if (this.originalCode) {
      this.loadTrip(this.originalCode);
    }
  }

  private loadTrip(code: string): void {
    this.tripDataService.getTrips(code)
      .subscribe({
        next: (value: Trip[]) => {
          const trip = value?.[0];
          if (!trip) {
            this.formError = 'No trip found with code ' + code;
            return;
          }
          const match = LENGTH_PATTERN.exec(trip.length ?? '');
          this.form.patchValue({
            ...trip,
            // Date inputs only accept yyyy-MM-dd so trim the ISO timestamp
            start: String(trip.start).split('T')[0],
            perPerson: Number(trip.perPerson),
            length: {
              nights: match ? Number(match[1]) : 0,
              days: match ? Number(match[2]) : 0,
            },
          });
        },
        error: () => {
          this.formError = 'Unable to load trip ' + code;
        },
      });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.formError = '';
    if (this.form.invalid) {
      return;
    }

    const { length, ...rest } = this.form.value;
    const trip: Trip = {
      ...rest,
      length: length.nights + ' nights / ' + length.days + ' days',
      perPerson: Number(rest.perPerson).toFixed(2),
    };

    this.saving = true;
    const request = this.isEdit
      ? this.tripDataService.updateTrip(trip, this.originalCode!)
      : this.tripDataService.addTrip(trip);

    request.subscribe({
      next: () => this.router.navigate(['/admin/travel']),
      error: (error: any) => {
        this.saving = false;
        this.formError = error?.error?.message || 'Unable to save the trip, please try again';
      },
    });
  }
}
