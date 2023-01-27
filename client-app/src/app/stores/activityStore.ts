import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Activity } from '../models/activity';
import {v4 as uuid} from 'uuid';
import { ObjectFlags } from 'typescript';
import { format, hoursToMinutes } from 'date-fns';
import { store } from './store';

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;


  constructor(){
    makeAutoObservable(this);
  }

  private setLoadingInitial = (state:boolean) => {
    this.loadingInitial=state;
  }

  private setActivity = (activity:Activity) =>{
    const user = store.userStore.user;
    if(user){
      activity.isGoing = activity.attendees!.some(
        a => a.username === user.userName
      );

      /**
       * username property is not populated as api returns userName
       */
      activity.isHost = activity.hostUsername === user.userName;
      activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
    }
    // activity.date = activity.date.split('T')[0];
    activity.date = new Date(activity.date!);
    //We are mutating state of activities here
    //It would be an anti pattern in ReduX
    this.activityRegistry.set(activity.id,activity);
  }

  get activitiesByDate(){
    return Array.from(this.activityRegistry.values()).sort((a,b) => a.date!.getTime() - b.date!.getTime());
  }

  get groupedActivities(){
    return Object.entries(
      this.activitiesByDate.reduce((activities,activity)=>{
        const date = format(activity.date!, 'dd MMM yyyy');
        activities[date] = activities[date] ? [...activities[date],activity] : [activity]
        return activities;
      }, {} as {[key: string]: Activity[]})
    )
  }

  loadActivities = async () =>{
    this.setLoadingInitial(true);
    try{
      const activities = await agent.Activities.list();
      runInAction(()=>{
        activities.forEach(activity => {
          this.setActivity(activity);
        })
        this.setLoadingInitial(false);
      })
    }
    catch(error){
      console.log(error);
      runInAction(()=>{
        this.loadingInitial = false;
      })
    }
  }

  loadActivity = async (id:string) => {
    let activity = this.getActivity(id);
    if(activity) {
      this.selectedActivity = activity;
      return activity;
    }
    else{
      this.setLoadingInitial(true);
      try{
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        runInAction(()=>{
          this.selectedActivity = activity;
        })
        this.setLoadingInitial(false);
        return activity;
      }
      catch(err){
        console.log(`Error while retrieving Activity from API: ${err}`)
        this.setLoadingInitial(false);
      }
    }

  }

  private getActivity = (id:string) =>{
    return this.activityRegistry.get(id);
  }

  createActivity = async (activity: Activity) => {
    this.loading = true;
    activity.id = uuid();
    try{
      await agent.Activities.create(activity);
      runInAction(()=>{
        this.activityRegistry.set(activity.id,activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      })
    }
    catch(error){
      console.log(error);
      runInAction(()=>{
        this.loading = false;
      })
    }
  }

  updateActivity = async (activity: Activity) =>{
    this.loading = true;
    try{
      await agent.Activities.update(activity);
      runInAction(()=>{
        this.activityRegistry.set(activity.id,activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading =false;
      })
    }
    catch(error){
      console.log(error);
      runInAction(()=>{
        this.loading =false;
      })
    }
  }

  deleteActivity = async (id: string) =>{
    this.loading = true;
    try{
      await agent.Activities.delete(id);
      runInAction(()=>{
        this.activityRegistry.delete(id);
        this.loading = false;        
      })
    }
    catch(error){
      console.log(error);
      runInAction(()=>{
        this.loading = false;
      })
    }
  }

}
 