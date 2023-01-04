import { Button, FormField, Label, Segment } from 'semantic-ui-react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Activity } from '../../../models/activity';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../../layout/LoadingComponents';
import {v4 as uuid} from 'uuid'; 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../common/form/MyTextInput';
import MyTextArea from '../../../common/form/MyTextArea';
import MySelectInput from '../../../common/form/MySelectInput';
import { categoryOptions } from '../../../common/options/CategoryOptions';
import MyDateInput from '../../../common/form/MyDateInput';


export default observer(function ActivityForm(){

  const {activityStore} = useStore();
  const {selectedActivity, createActivity, updateActivity, loading, loadActivity, loadingInitial} = activityStore;

  const {id} = useParams();
  const navigate = useNavigate();

  const [activity,setActivity] = useState<Activity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue:''
  })

  const validationSchema = Yup.object({
    title: Yup.string().required('The activity title is required'),
    description: Yup.string().required('The activity description title is required'),
    category: Yup.string().required('The activity category title is required'),
    date: Yup.string().required(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  useEffect(()=>{
    if(id) loadActivity(id).then(activity =>  setActivity(activity!));
  },[id,loadActivity]);

  // function handleSubmit(){
  //   if(!activity.id){
  //     activity.id = uuid();
  //     createActivity(activity).then(()=>navigate(`/activities/${activity.id}`))
  //   }
  //   else{
  //     updateActivity(activity).then(()=>navigate(`/activities/${activity.id}`));
  //   }
  // }

  // function handleChange(event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>){
  //   const {name,value} = event.target;
  //   setActivity({...activity, [name]:value})
  // }

  if(loadingInitial) return <LoadingComponent content='Loading Activity...'/>


  return(
    <Segment>
      <Formik
      validationSchema={validationSchema} 
      enableReinitialize 
      initialValues={activity} 
      onSubmit={values => console.log(values)}>
        {({handleSubmit})=>(
          <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
            <MyTextInput name='title' placeholder='Title'/>
            <MyTextArea rows={3} placeholder='Description' name='description' />
            <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
            <MyDateInput placeholderText='Date' name='date' showTimeSelect timeCaption='time' dateFormat='MMMM d, yyyy h:mm: aa' />
            <MyTextInput placeholder='City' name='city' />
            <MyTextInput placeholder='Venue' name='venue' />
            <Button loading={loading} floated='right' positive type='submit' content='Submit'/>
            <Button as={Link} to='/activities' floated='right' type='button' content='Cancel'/>
          </Form> 
        )}
      </Formik>
    </Segment>
  )
})