import {Component, inject} from '@angular/core';
import {DecimalPipe, NgIf} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {MapViewComponent} from "../../components/map-view/map-view.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Select} from "primeng/select";
import {ServiceModalComponent} from "../../components/service-modal/service-modal.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {serviceCategories} from "../../utils/service-categories";
import {ServiceSeekersListingService} from "./service-seekers-listing.service";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
  selector: 'app-service-seekers-listing',
  standalone: true,
  imports: [
    DecimalPipe,
    InputTextModule,
    MapViewComponent,
    ReactiveFormsModule,
    Select,
    ServiceModalComponent,
    FormsModule,
    RouterLink,
    NgIf,
    ProgressSpinnerModule
  ],
  templateUrl: './service-seekers-listing.component.html',
  styleUrl: './service-seekers-listing.component.scss'
})
export class ServiceSeekersListingComponent {
  services = [];
  filteredServices: any = [...this.services];
  selectedCategories = [];
  selectedServiceTypes = [];
  selectedPaymentTypes = [];
  route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ServiceSeekersListingService);
  public serviceModalOpen = false;
  public selectedService = null;
  searchText: string = '';
  isLoading = false;

  public sortOptions = [
    {label: 'Rastući', value: 'asc'},
    {label: 'Padajući', value: 'desc'},
  ];
  public selectedSortOrder = this.sortOptions[0];

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchText = params['searchText'] || '';
      this.service.getAll().subscribe((services: any) => {
        this.services = services.serviceSeekers?.map((service) => {
          service.searchableText = (`
          ${service.name}
          ${service.description}
          ${service.category}
          ${service.type}
          ${service.paymentType}
          ${service.price}
          ${Array.isArray(service.tags) ? service.tags.join(' ') : service.tags}
        `).toLowerCase();
          return service;
        });
          this.applyFilters();
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
    });
  }


  // Filter by category
  filterByCategory(category: string) {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories?.filter(
        (cat) => cat !== category
      );
    } else {
      this.selectedCategories.push(category);
    }
    this.applyFilters();
  }

  // Filter by service type
  filterByServiceType(type: string) {
    console.log(type);
    if (this.selectedServiceTypes.includes(type)) {
      this.selectedServiceTypes = this.selectedServiceTypes?.filter(
        (t) => t !== type
      );
    } else {
      this.selectedServiceTypes.push(type);
    }
    this.applyFilters();
  }

  // Filter by payment type
  filterByPaymentType(paymentType: string) {
    console.log(typeof paymentType);
    if (this.selectedPaymentTypes.includes(paymentType)) {
      this.selectedPaymentTypes = this.selectedPaymentTypes?.filter(
        (pt) => pt !== paymentType
      );
    } else {
      this.selectedPaymentTypes.push(paymentType);
    }
    this.applyFilters();
  }

  // Apply all filters
  applyFilters() {
    const searchTextLower = this.searchText.toLowerCase();

    this.filteredServices = this.services?.filter((service) => {
      const matchesCategory = this.selectedCategories.length
        ? this.selectedCategories.includes(service.category)
        : true;
      const matchesType = this.selectedServiceTypes.length
        ? this.selectedServiceTypes.includes(service.type)
        : true;
      const matchesPayment = this.selectedPaymentTypes.length
        ? this.selectedPaymentTypes.includes(service.paymentType)
        : true;

      const matchesSearchText = this.searchText
        ? this.serviceMatchesSearchText(service, searchTextLower)
        : true;

      return matchesCategory && matchesType && matchesPayment && matchesSearchText;
    });
  }

  private serviceMatchesSearchText(service: any, searchText: string): boolean {
    const combinedText = `
    ${service.name}
    ${service.description}
    ${service.category}
    ${service.type}
    ${service.paymentType}
    ${service.price}
    ${Array.isArray(service.tags) ? service.tags.join(' ') : service.tags}
  `.toLowerCase();

    return combinedText.includes(searchText);
  }


  // Sort by price
  sortByPrice(sortOrder: string) {
    this.filteredServices.sort((a, b) =>
      sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    );
  }

  openServiceModal(service) {
    this.serviceModalOpen = true;
    this.selectedService = service;
  }

  closeServiceModal() {
    this.serviceModalOpen = false;
    this.selectedService = null;
  }

  getCoordinates(geolocation: string): [number, number] | null {
    if (geolocation) {
      const coords = geolocation
        .split(',')
        .map((coord) => parseFloat(coord.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        return [coords[0], coords[1]];
      }
    }
    return null;
  }

  protected readonly serviceCategories = serviceCategories;
}
