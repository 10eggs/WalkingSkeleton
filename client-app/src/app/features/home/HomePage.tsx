import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import LoginForm from '../users/LoginForm';

export default observer (function HomePage(){

  const { userStore,modalStore } = useStore();
  return(
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1'>
          <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom: 12}}/>
          Reactivities
        </Header>
        {userStore.isLoggedIn ? (
          <>
            <Header as='h2' inverted content='Welcome to Reactivites'/>
            <Button as={Link} to='/activities' size='huge' inverted>
              Go to Activities!
            </Button>
          </>
        ) : (
          <>
          <Button onClick={() => modalStore.openModal(<LoginForm/>)} size='huge' inverted>
            Login
          </Button>
          <Button onClick={() => modalStore.openModal(<h1>Register</h1>)} size='huge' inverted>
            Register
          </Button>
          </>
        )}
      </Container>
    </Segment>
  )
})