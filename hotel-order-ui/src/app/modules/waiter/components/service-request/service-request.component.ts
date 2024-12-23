import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ServiceRequestResponse } from '../../../../services/models';
import { ServiceRequestsService } from '../../../../services/services';
import { formatDistanceToNow } from 'date-fns';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WaiterService } from '../../services/waiter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-service-request',
  imports: [CommonModule,FormsModule],
  providers:[DatePipe],
  standalone: true,
  templateUrl: './service-request.component.html',
  styleUrl: './service-request.component.scss'
})
export class ServiceRequestComponent implements OnDestroy{
  requestList:ServiceRequestResponse[] = [];
  filteredRequestList:ServiceRequestResponse[] = [];
  searchedText:string = '';
  selectedRquestType:string = 'CALL';
  serviceStatusList = ['PENDING', 'COMPLETED'];
  notifCounterMap = new Map<string,number>();
  requestNotifSub?:Subscription;

  constructor(
    private datePipe:DatePipe,
    private requestService:ServiceRequestsService,
    private toastrService:ToastrService,
    private waiterService:WaiterService
  ){}

  ngOnInit(): void {
    this.fetchPendingCallRequest();
    this.onRequestNotification();
    this.onRequestNotificationCounter();
    // rest notify counter
    this.resetNotifCounter();
  }

  // on request notification
  onRequestNotification(){
    this.requestNotifSub =  this.waiterService.requestNotification$
    .subscribe(request => {
      const type = request.serviceType as string;
      if(type === this.selectedRquestType){
        this.requestList.push(request);
        this.filteredRequestList = this.requestList;
        this.resetNotifCounter();
      } 
    })
  }

  // request notif counter
  onRequestNotificationCounter(){
    this.waiterService.requestNotifCounter$.subscribe(map => {
      this.notifCounterMap = map;
    });
  }

  // reset notif counter
  resetNotifCounter(){
    this.waiterService.updateRequestNotifCounterMap(this.selectedRquestType, 0);
  }

  // fetch pending call requests
  fetchPendingCallRequest(){
    this.requestService.getPendingCallRequest().subscribe({
      next:(res:ServiceRequestResponse[]) =>{
        this.requestList = res;
        this.filteredRequestList = res;
      },
      error:(err)=>{
        console.log(err);
        this.toastrService.error('Something went wrong', 'Ooops');
      }
    })
  }

  // fetch pending bill requests
  fetchPendingBillRequests(){
    this.requestService.getPendingBillRequest().subscribe({
      next:(res:ServiceRequestResponse[]) =>{
        this.requestList = res;
        this.filteredRequestList = res;
      },
      error:(err)=>{
        console.log(err);
        this.toastrService.error('Something went wrong', 'Ooops');
      }
    })
  }

  // fetch by type
  fetchServiceByType(type:string){
    if(type === 'CALL'){
      this.fetchPendingCallRequest();
    } else if(type === 'BILL'){
      this.fetchPendingBillRequests();
    }
  }

  // change request type 
  changeRequestType(type:string){
    this.selectedRquestType = type;
    this.requestList = [];
    this.filteredRequestList = [];
    this.resetNotifCounter();
    this.fetchServiceByType(type);
  }

  // on serach
  onSearch(){
    if(this.searchedText.length !== 0){
      this.filteredRequestList = this.requestList.filter(order =>{
        if(order.location?.number && order.location.type){
          return String(order.location.number).includes(this.searchedText) || 
          order.location.type.toLocaleLowerCase().startsWith(this.searchedText.toLocaleLowerCase())
        }
        return false;
      }) 
    } else {
      this.changeRequestType(this.selectedRquestType);
    }
  }

  // on status change
  onStatusChange(requestId:any){
    this.requestService.updateServiceRequestStatus({
      'request_id': requestId ,
    }).subscribe({
        next:(res)=>{
          this.requestList = [];
          if(this.selectedRquestType === 'CALL'){
            this.fetchPendingCallRequest();
          } else if(this.selectedRquestType === 'BILL'){
            this.fetchPendingBillRequests();
          }
        },
        error:(err)=>{
          console.log(err)
          this.toastrService.error('Something went wrong', 'Ooops');
        }
      })
  }

  //transfrom date
  transformDate(dateString:any){
    const date = new Date(dateString);
    const formattedDate = this.datePipe.transform(date, 'EEE, dd , y')
    return formattedDate;
  }

  //transfrom time
  transfromTime(dateString:any){
    const date = new Date(dateString);
    const fromattedTime = this.datePipe.transform(date, 'hh:mm a');
    return fromattedTime;
  }

  //transfrom  duaration
  calculateDuration(dateString:any){
    const date = new Date(dateString);
    const duration = formatDistanceToNow(date, {addSuffix: true})
    return duration;
  }

  ngOnDestroy(): void {
    this.requestNotifSub?.unsubscribe();
  }

}
