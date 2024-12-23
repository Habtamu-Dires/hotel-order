import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdResponse, LocationRequest, LocationResponse } from '../../../../services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationsService } from '../../../../services/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-location',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './manage-location.component.html',
  styleUrl: './manage-location.component.scss'
})
export class ManageLocationComponent {
  
  errMsgs:Array<string> = [];
  locationRequest:LocationRequest = {
    type: '',
    number: Number(undefined),
    description: '',
    status: '',
    address: ''
  }
  showCategories:boolean = false;
  categoryName:string = '';
  locationTypes:string[] = ['TABLE','ROOM'];
  locationStatus:string[] = ['READY','ONCHANGE','OCCUPIED','DND','OOO'];
  showTypeList:boolean = false;
  showStatusList:boolean = false;

  constructor(
    private activatedRoute:ActivatedRoute,
    private locationService:LocationsService,
    private router:Router,
    private toastrService:ToastrService
  ){}

  ngOnInit(): void {
    // edit
    const itemId = this.activatedRoute.snapshot.params['locationId'];
    if(itemId){
      this.fetchLocationById(itemId);
    }
  }

  //on type selected
  onTypeSelected(type:string){
    this.locationRequest.type = type;
    this.showTypeList = false;
  }

  setShowTypeList(){
    this.showTypeList = true;
  }

  //on status selected
  onStatusSelected(status:string){
    this.locationRequest.status = status;
    this.showStatusList = false;
  }

  //fetch location by Id
  fetchLocationById(id:string){
    this.locationService.getLocationById({
      'location-id': id
    }).subscribe({
      next:(res:LocationResponse) =>{
        this.locationRequest = {
          id: res.id,
          type: res.type as string,
          number: res.number as number,
          description: res.description as string,
          status: res.status as string,
          address: res.address as string
        }
      },
      error:(err)=>{console.log(err)}
    })
  }
  
  // save
  onSave(){
    this.errMsgs = [];
    this.locationService.saveOrderLocation({
      body: this.locationRequest
    }).subscribe({
      next:(res:IdResponse)=>{
        this.router.navigate(['admin','locations']);
        this.toastrService.success('Item saved successfully ', 'Done!')
      },
      error:(err) => {
        if(err.error.validationErrors){
          this.errMsgs = err.error.validationErrors;
        } else{
          console.log(err);
          this.toastrService.error(err.error.error, 'Ooops');
        }
      }
    })
  }
  
  // cnacel
  onCancel(){
    this.router.navigate(['admin','locations']);
  }
}
