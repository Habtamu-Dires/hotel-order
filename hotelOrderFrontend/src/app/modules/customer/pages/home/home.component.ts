import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { LocationResponse, MessageResponse, ServiceRequestRequest } from '../../../../services/models';
import { LocationsService, ServiceRequestsService } from '../../../../services/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isServiceModalVisible:boolean = false;
  tempLocInfoHolder = {type:'', number: Number(undefined)}
  submitBtnClicked:boolean = false;
  locationList:LocationResponse[] = [];
  filteredLocations:LocationResponse[]=[];
  serviceRequestType?:string;
  isNumberInputOnFocus:boolean = false;
  isNumberMenuVisible:boolean = false;
  orderLocation?:LocationResponse;
  componentName:string = 'home';

  serviceRequest:ServiceRequestRequest = {
    locationId: '',
    serviceType: ''
  }

  constructor(
    private router:Router,
    private locationService:LocationsService,
    private requestService:ServiceRequestsService,
    private toastrService:ToastrService
  ){}

  // redirct to menu
  redirectToMenu(){
    this.router.navigate(['customer','menu'])
  }

  // open service modal
  openServiceModal(serviceType:string){
    this.isServiceModalVisible = true;
    this.serviceRequestType = serviceType;
    // fetch locations
    this.fetchAllOrderLocations();
  } 
  // fetch locations
  fetchAllOrderLocations(){
    this.locationService.getAllOrderLocations().subscribe({
      next:(response:LocationResponse[]) => {
        this.locationList = response;
        this.filteredLocations = response;
      },
      error:(err) => {
        console.log(err);
        this.toastrService.error('Connection Error', 'Oops');
      }
    })
  }

  closeServiceModal(){
    this.isServiceModalVisible = false;
    this.serviceRequestType = undefined;
  }

  //onLocation type change
  onLocationTypeChange(){
    if(this.tempLocInfoHolder.type) {
      this.tempLocInfoHolder.number = Number(undefined);
      this.isNumberInputOnFocus = false;
      this.orderLocation = undefined;
    }
  }
  //onLocation number clicked
  onNumberInputFocus(){
    this.isNumberInputOnFocus = true;
    this.isNumberMenuVisible = true;
  }
  //get filtered location
  getFilteredLocations(){
    const inputValue = this.tempLocInfoHolder.number?.toString();
    if(inputValue){
     this.filteredLocations = this.filteredLocations.filter((location) =>
      location.type === this.tempLocInfoHolder.type && location.number?.toString().startsWith(inputValue)
    );
    } else {
      this.filteredLocations = this.locationList;
      this.tempLocInfoHolder.number = Number(undefined);
      this.orderLocation = undefined;
    }
  }

  //set location number
  setLocationNumber(location:LocationResponse){
    this.tempLocInfoHolder.number = Number(location.number);
    this.orderLocation = location;
    this.isNumberMenuVisible = false;
  }

   sendServiceRequest(){
    this.submitBtnClicked = true;
    if(this.orderLocation && this.serviceRequestType){
      const serviceRequest:ServiceRequestRequest = {
        locationId: this.orderLocation.id as string,
        serviceType: this.serviceRequestType
      }
      this.requestService.createServiceRequest({
        body: serviceRequest
      }).subscribe({
        next:(res:MessageResponse) =>{
          const message = res.message;
          this.toastrService.success(message,'Done');
          this.isServiceModalVisible = false;
          this.submitBtnClicked = false;
        },
        error:(err) => {
          console.log(err);
          this.toastrService.error('Something went wrong', 'Oops');
        }
      })
    }
  }
  

  
}
