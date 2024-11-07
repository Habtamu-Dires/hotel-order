import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceRequest } from '../../services/models/serviceRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../../services/shared/shared.service';
import { ApiResponse } from '../../services/models/api_response';
import { Observable } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit{

  serviceRequestList:ServiceRequest[] = [];
  filteredServiceRequests:ServiceRequest[] = [];
  serachText:string = '';
  selectedServiceType:string = 'All';

  serviceStatusList = ['PENDING', 'COMPLETED'];

  constructor(private http:HttpClient,
    private sharedService:SharedService,
    private datePipe:DatePipe
  ){}

  ngOnInit(): void {
    this.fetchServiceRequests().subscribe({
      next:(response:ApiResponse<ServiceRequest[]>) =>{
        this.serviceRequestList = response.data;
        this.filteredServiceRequests = response.data;
      },
      error:(error:HttpErrorResponse) => {
        console.error(error);
      }
    })
  }

  // on serach
  onSearch(){
    this.filteredServiceRequests = this.serviceRequestList.filter((request) =>
      request.location?.number.toString().startsWith(this.serachText) ||
      request.location?.type.toLocaleLowerCase().startsWith(this.serachText.toLocaleLowerCase())
    );
  }

  //fetch pednding service requests
  fetchServiceRequests():Observable<ApiResponse<ServiceRequest[]>>{
    const base_url =  this.sharedService.getBaseUrl();
    return this.http.get<ApiResponse<ServiceRequest[]>>(`${base_url}/service-requests/pending`);
  }

  //update service request to completed
  updateSeviceRequests(serviceId:string):Observable<ApiResponse<null>>{
    const base_url =  this.sharedService.getBaseUrl();
    return this.http.put<ApiResponse<null>>(`${base_url}/service-requests/${serviceId}`,{})
  }

  //transform time
  transformTime(dateString:any){
    if(dateString){
      const date = new Date(dateString);
      const formattedTime = this.datePipe.transform(date, 'hh:mm a')
      return formattedTime;
    }
    return '';
  }

  //calculate duration
  calculateDuration(dateString:any){
    if(dateString){
      const date = new Date(dateString);
      const duration = formatDistanceToNow(date, {addSuffix: true})
      return duration;
    }
    return '';
  }

  // on status change
  onStatusChange(event:any, requestId:any){
    const status = event.target.value;
    if(requestId && status === 'COMPLETED'){
      this.updateSeviceRequests(requestId).subscribe({
        next:(response:ApiResponse<null>) => {
          console.log(response.success)
        },
        error:(error:HttpErrorResponse) => {
          console.log(error);
        }
      });
    }
  }

  //change selected service request type
  changeSelectedServiceType(serviceType:string){
    this.selectedServiceType = serviceType;
    if(serviceType !== 'All'){
      this.filteredServiceRequests = this.serviceRequestList.filter((service)=>
        service.serviceType === serviceType
      );
    } else {
      this.filteredServiceRequests = this.serviceRequestList;
    }
  }



}
