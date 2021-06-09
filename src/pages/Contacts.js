import { useState, useEffect } from 'react';
import Card from '../components/Card'
import './Contacts.css'
import { useHistory } from 'react-router-dom';

function Contacts() {
  let history = useHistory();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  const [contacts, setContacts] = useState([]);
  //creating a useEffect that runs at every update
  //if there is no token in the local storage it redirects to the auth page
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      history.push('/auth');
    }
  })

  const headers = {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token')
  }

  const fillForm = (e, field) => {
    let newForm = {
      ...form
    };
    newForm[field] = e.target.value;
    setForm(newForm);
  }

  const formSubmitHandler = (e) => {
    e.preventDefault();

    let finalForm = new FormData(); //by default content type is multipart/form-data

    finalForm.append('fullName', form.fullName);
    finalForm.append('email', form.email);
    finalForm.append('phone', form.phone);
    finalForm.append('address', form.address);
    finalForm.append('file', e.target[4].files[0]);

    console.log(finalForm);
    const url = 'https://contact-list-backend-2021.herokuapp.com/contacts/new';
    const options = {
      method: 'POST',
      headers: {      
        'x-auth-token': localStorage.getItem('token')
      },
      body: finalForm
    }

    fetch(url, options)
      .then(response => response.json().then(res => {
        if (res.errors) {
          alert(` ${res.message} `);
        } else {
          setContacts([...contacts, res])
        }
      })).catch(err => console.log(err))

    /* setContacts([...contacts, form]) */
  }

  useEffect(() => {
    const url = 'https://contact-list-backend-2021.herokuapp.com/contacts/all';
    const options = {
      headers
    }

    fetch(url, options).then(data => data.json().then(output => {
      if (output.status === 'success') {
        setContacts(output.data)
      } else {
        console.log(output.message);
      }
    }))
  }, [])

  const deleteContact = (id) => {
    const url = 'https://contact-list-backend-2021.herokuapp.com/contacts/' + id;
    const options = {
      method: 'DELETE',
      headers
    }

    fetch(url, options)
      .then(response => response.json().then(output => {
        //catching back end errors with if/else
        if (output.status === 'success') {
          alert(output.message)
          const newList = contacts.filter(contact => {
            if (contact._id != output.data) {
              return contact
            }
          })
          setContacts(newList);
        } else {
          alert('theres an error! please check console')
          console.log(output.message);
        }
        //catching errors on the communication between client side and server side
      })).catch(err => alert(err));
  }

  const updater = (id, avatar) => {
    let newContacts = [...contacts]
    let updatedIndex = newContacts.findIndex(contact => contact._id === id);
    newContacts[updatedIndex].avatar = avatar;

    setContacts(newContacts);
  }
  
  let cards;
  if (typeof(contacts)==='object' && contacts.length > 0) {
    cards = contacts.map(contact => 
      <Card 
        updater={updater}
        key={contact._id} 
        contact = {contact}
        deleteContact = {() => deleteContact(contact._id)}
      />)
  }

    return (
      <div className='App'>
        <h1>My Contact List</h1>
        <form className="form" onSubmit = {formSubmitHandler}> 
          <input placeholder="Full name" required value = {form.fullName} onChange = {(e) => fillForm(e, "fullName")}/>
          <input placeholder="Email" type = "email" value = {form.email} onChange = {(e) => fillForm(e, "email")}/>
          <input placeholder="Phone number" type = "tel" value = {form.phone} onChange = {(e) => fillForm(e, "phone")}/>
          <input placeholder="Address" value = {form.address}  onChange = {(e) => fillForm(e, "address")}/>
          <input type="file"/>
          <button>Create Contact</button>
        </form>

        <section className = "card-section">
          {cards}
        </section>
      </div>
    );
  }

  export default Contacts;


  /* resetting the form after submitting    

  setForm({
                fullName: '', 
                email: '', 
                phone: '', 
                address: ''
              }) */



