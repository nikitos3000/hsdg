import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';

export default () => {
  const html = `
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

  const container = document.querySelector('.form-container');
  container.innerHTML = html;

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

  function validNumber(number) {
    if (number.trim().length === 11 && number.startsWith('+')) {
      return true;
    }
    return false;
  }

  const validateName = (name) => (name.trim().length ? [] : ['name cannot be empty']);
  const validateEmail = (phoneNumber) => (validNumber(phoneNumber) ? [] : ['invalid number']);
  const validateField = (fieldname, data) => (fieldname === 'name' ? validateName(data) : validateEmail(data));

  const form = document.querySelector('form');
  const submit = document.querySelector('[type="submit"]');

  const hasErrors = () => (_.values(state.errors).reduce((acc, curr) => (curr.length > 0
    ? acc.concat(curr)
    : acc), [])
    .length > 0);

  const watchedState = onChange(state, (path) => {
    const selector = path.split('.')[1];
    const input = document.querySelector(`[name=${selector}]`);
    const isFieldValid = validateField(selector, state.values[selector]).length === 0;
    if (!isFieldValid) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }
    submit.disabled = hasErrors(state);
  });

  form.addEventListener('input', (e) => {
    e.preventDefault();
    const targetName = e.target.name;
    const targetData = new FormData(form).get(targetName);
    watchedState.values[targetName] = targetData;
    watchedState.errors[targetName] = (validateField(targetName, targetData));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    axios.post('/people', state.values)
      .then((response) => {
        console.log(response);
        document.body.innerHTML = '<h3 class="mb-4">User successfully registered</h3>';
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
