import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Header,List } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../features/activities/dashboard/ActivityDashboard';

function App() {

  const [activities,setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined >(undefined);

  useEffect(()=>{
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      setActivities(response.data);
    });
  },[]);

  function handleSelectedActivity(id: string){
    setSelectedActivity(activities.find(x=>x.id === id));
  }

  function handleCancelSelectActivity(){
    setSelectedActivity(undefined);
  }

  return (
    <>
      <NavBar/>
      <Container style ={{margin: '7em'}}>
        <ActivityDashboard activities={activities}
        selectedActivity={selectedActivity}
        selectActivity={handleSelectActivity}
        cancelSelectActivity={handleCancelActivity}
        />
      </Container>
    </>
  );
}

export default App;
