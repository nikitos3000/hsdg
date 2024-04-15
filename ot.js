import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';

export default () => {
    const html =`
    <form id="registrationForm">
    <div class="form-group">
        <label for="inputName">Name</label>
        <input type="text" class="form-control" id="inputName" placeholder="Input name" name="name" required>
    </div>
    <div class="form-group">
        <label for="inputPhone">Phone</label>
        <input type="text" class="form-control" id="inputPhone" placeholder="Input phone" name="phone" required>
    </div>
    <input type="submit" value="Submit" class="btn btn-primary">
    </form>`;

    const container = document.querySelector('.form-container')
    container.innerHTML = html

    const state = {
        errors: {
          name: [],
          number: [],
        },
        values: {
          name: '',
          number: '',
        },
      };

    const form = document.querySelector('form');
    const submit = document.querySelector('[type="submit"]');

    
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        axios.post('/people', state.values)
          .then((response) => {
            console.log(response)
            document.body.innerHTML = `<h3 class="mb-4">User successfully registered</h3>`;
          })
          .catch((error) => {
            console.log(error);
          });
      });
    


}
