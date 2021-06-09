import './Auth.css'
import { useHistory } from 'react-router-dom';

export default function (props) {
    let history = useHistory();
    let submitHandler = (e) => {
        e.preventDefault(); 

        let data = {}; //create an object to fill in the form information

        //first we have to make sure that the name email is the same as backend (case sensitive!)
        //this is not the secure way to do it since if we change the order of input fields it does not work!
        data.email = e.target[0].value;
        data.pass = e.target[1].value;

        let urlRegister = 'https://contact-list-backend-2021.herokuapp.com/auth/register';
        let urlLogin = 'https://contact-list-backend-2021.herokuapp.com/auth/login';
        let options = {
            method :'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        }

        if (e.nativeEvent.submitter.id == "register") {
            fetch(urlRegister, options)
            .then(result => result.json()
            .then(output => console.log(output.message)/* props.loginSetter(true) */))
            /* props.userSetter(data.email); */
            
        } else if (e.nativeEvent.submitter.id == "login") {
            fetch(urlLogin, options)
            .then(result => result.json()
            .then(output=>{
                console.log(output);
                localStorage.setItem('token', output.token);
                history.push('/contacts')
                /* if (output.status == 'success') {
                    localStorage.setItem('token', output.token);
                    props.loginSetter(true);
                    props.userSetter(data.email);
                } else {
                    alert('fail')
                } */}))
        }
    }

    return (
        <div className='wrapper'>
            <form onSubmit = {submitHandler}>
                <h2>Login or Register</h2>
                <input name = "email" type = "email"/>
                <input name = "pass" type ="password"/>
                <section>
                    <input id ="register" type = "submit" value ="Register"/>
                    <input id ="login" type = "submit" value ="Login"/>
                </section>
            </form>
        </div>
    )
}
