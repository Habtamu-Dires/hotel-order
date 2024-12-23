import { Component, OnInit } from '@angular/core';
import { MenuComponent } from "../../components/menu/menu.component";
import { LocationResponse, PageResponseLocationResponse } from '../../../../services/models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocationsService } from '../../../../services/services';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { PageNavigationComponent } from "../../components/page-navigation/page-navigation.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [MenuComponent, FormsModule, CommonModule, PageNavigationComponent],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss'
})
export class LocationsComponent implements OnInit{

  locationList:LocationResponse[] = [];
  // pagination
  page:number = 0;
  size:number = 5;
  isEmptyPage: boolean = true;
  isFirstPage: boolean |undefined; 
  isLastPage: boolean |undefined;
  totalPages: number | undefined;
  totalElements: number | undefined;
  numberOfElements: number | undefined;
  filter:string = 'All';

  constructor(
    private locationService:LocationsService,
    private router:Router,
    private dialog:MatDialog,
    private toastrService:ToastrService
  ){}

  ngOnInit(): void {
    this.fetchPageOfLocations();
  }

  onTypeFilterChange(filter: string) {
    this.filter = filter;
    this.page = 0;
    this.fetchPageOfLocationByType();
  }
  
  onSerchedTextChange(text: string) {
    const locNum = Number(text);
    if(locNum){
      this.searchLocationBynumber(locNum);
    } else{
      this.fetchPageOfLocationByType();
    }
  }

  // search location by number and type
  searchLocationBynumber(locNum:number){
   this.locationService.searchLocationByNumber({
    'location-number': locNum,
    'location-type' : this.filter
   }).subscribe({
    next:(res:LocationResponse[])=>{
      this.locationList = res;
      this.isEmptyPage = true;
    },
    error:(err) => {console.log(err)}
   })
  }

  // fetch page of location by filter(type)
  fetchPageOfLocationByType(){
    this.locationService.getPageOfLocationByType({
      'location-type': this.filter,
      page: this.page,
      size: this.size
    }).subscribe({
      next:(res:PageResponseLocationResponse) =>{
        this.locationList = res.content as LocationResponse[];
        //pagination
        this.isEmptyPage = res.empty as boolean;
        this.isFirstPage = res.first;
        this.isLastPage = res.last;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.numberOfElements = res.numberOfElements;
        this.page = res.number as number;
        this.size = res.size as number;
      },
      error:(err) => {console.log(err)}
    })
  }


  //fetch page of locations
  fetchPageOfLocations(){
    this.locationService.getPageOfLocations({
      page: this.page,
      size: this.size
    }).subscribe({
      next:(res:PageResponseLocationResponse) =>{
        this.locationList = res.content as LocationResponse[];
         //pagination
         this.isEmptyPage = res.empty as boolean;
         this.isFirstPage = res.first;
         this.isLastPage = res.last;
         this.totalPages = res.totalPages;
         this.totalElements = res.totalElements;
         this.numberOfElements = res.numberOfElements;
         this.page = res.number as number;
         this.size = res.size as number;
      },
      error:(err)=>{console.log(err)}
    })
  }


  // create new location
  onCreateNewBtnClicked() {
    this.router.navigate(['admin','locations','manage'])
    
  }
  // on edit
  onEdit(locationId:any){
    this.router.navigate(['admin','locations','manage', locationId as string])
  }
  // on delete
  onDelete(locationId:any){
    const dialog = this.dialog.open(ConfirmDialogComponent);

    dialog.afterClosed().subscribe(result =>{
      if(result){
        this.locationService.deleteLocationById({
          'location-id' : locationId
        }).subscribe({
          next:()=>{
            this.fetchPageOfLocations();
            this.toastrService.success('Item deleted successfully', 'Done!');
          },
          error:(err) => {
            console.log(err);
            this.toastrService.error('Something went wrong', 'Ooops');
          }
        })
      } else{
        console.log("deletion canceled")
      }
    })
  }

  // pagination methods
   onSizeChanged(size:number){
    this.size = size;
    this.fetchPageOfLocationByType();
   }

   onPageChanged(page:number){
    this.page = page;
    this.fetchPageOfLocationByType();
   }
}
