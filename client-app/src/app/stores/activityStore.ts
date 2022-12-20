import { makeAutoObservable } from 'mobx';
import { Activity } from '../models/activity';

export default class ActivityStore {

  activities: Activity[]=[];
  selectedActivity: Activity | null = null;
  editMode = false;
  loadingProperty = false;
  loadingInitial = false;


  constructor(){
    makeAutoObservable(this);
  }

  loadActivities = () =>{
    this.loadingInitial = true;
  }
}