// import { Component, OnInit, Output, output } from '@angular/core';
// import { Route, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { OrderLocationService } from '../../services/old-services/orderLocation/order-location.service';
// import { ApiResponse } from '../../services/old-services/models/api_response';
// import { OrderLocation } from '../../services/old-services/models/orderLocation';
// import { HttpErrorResponse } from '@angular/common/http';
// import { ServiceRequest } from '../../services/old-services/models/serviceRequest';
// import { SharedService } from '../../services/shared/shared.service';
// import { HeaderComponent } from '../header/header.component';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [FormsModule,CommonModule,HeaderComponent],
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.scss'
// })
// export class HomeComponent implements OnInit{

//   isModalVisible:boolean = false;
//   locationNumber?:number;
//   locationType?:string;
//   submitBtnClicked:boolean = false;
//   locationList:OrderLocation[]=[];
//   filteredLocations:OrderLocation[]=[];
//   serviceRequestType?:string;
//   isLocationNumberClicked:boolean = false;
//   isLocationNumberListOpen:boolean = false;
//   orderLocation?:OrderLocation;
//   showNotification:boolean = false;
//   serviceRequestSuccess:boolean = false;
//   notificationMessage:string = '';

//   @Output() componentName:string = 'home';

//   constructor(
//     private router:Router,
//     private locationService:OrderLocationService,
//     private sharedService:SharedService
//   ){}

//   ngOnInit(): void {
//     //location
//     this.locationService.fetchLoacations().subscribe({
//       next:(response:ApiResponse<OrderLocation[]>) =>{
//         this.locationList = response.data;
//         this.filteredLocations = response.data;
//       },
//       error:(error:HttpErrorResponse)=>{
//         console.log(error);
//       }
//     })
//   }

//   redirectToMenu(){
//     this.router.navigate(['/menu'])
//   }

//   //onLocation type change
//   onLocationTypeChange(){
//     if(this.locationType) {
//       this.locationNumber = undefined;
//       this.isLocationNumberClicked = false;
//       this.orderLocation = undefined;
//     }
//   }
//   //onLocation number clicked
//   onLocationNumberClicked(){
//     this.isLocationNumberClicked = true;
//     this.isLocationNumberListOpen = true;
//   }
//   //get filtered location
//   getFilteredLocations(){
//     const inputValue = this.locationNumber?.toString();
//     if(inputValue){
//      this.filteredLocations = this.filteredLocations.filter((location) =>
//       location.type === this.locationType && location.number.toString().startsWith(inputValue)
//     );
//       console.log(this.filteredLocations);
//     } else {
//       this.filteredLocations = this.locationList;
//       this.locationNumber = undefined;
//       this.orderLocation = undefined;
//     }
//   }

//   //set location number
//   setLocationNumber(location:OrderLocation){
//     this.locationNumber = location.number;
//     this.orderLocation = location;
//     this.isLocationNumberListOpen = false;
//   }

//   openModal(serviceType:string){
//     this.isModalVisible = true;
//     this.serviceRequestType = serviceType;
//   }

//   closeModal(){
//     this.isModalVisible = false;
//     this.serviceRequestType = undefined;
//   }

//   submitModal(){
//     this.submitBtnClicked = true;
//     if(this.orderLocation && this.serviceRequestType){
//       console.log(this.orderLocation)
//       this.isModalVisible = false;
//       const serviceRequest:ServiceRequest = {
//         locationId: this.orderLocation.id,
//         serviceStatus: 'PENDING',
//         serviceType: this.serviceRequestType,
//       }
//       this.sharedService.postServiceRequest(serviceRequest).subscribe({
//         next:(response:ApiResponse<null>) =>{
//           this.submitBtnClicked = false;
//           if(response.success){
//             //show success message modal
//             this.notificationMessage = response.message;
//             this.serviceRequestSuccess = true;
//             this.showNotification = true;
//             setTimeout(()=>{
//               this.showNotification = false;
//             }, 2000);
//           } 
//         },
//         error:(error:HttpErrorResponse)=>{
//           console.log(error);
//           this.submitBtnClicked = false;
//           this.notificationMessage = `${this.serviceRequestType} request error`;
//             this.serviceRequestSuccess = false;
//             this.showNotification = true;
//             setTimeout(()=>{
//               this.showNotification = false;
//             }, 2000);
//         }
//       })
//     }
//   }

//   //close notification
//   closeNotification(){
//     this.showNotification = false;
//   }
// } 
