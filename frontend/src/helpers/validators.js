import { required, email as emailRule, sameAs } from 'vuelidate/lib/validators'

export const userName = [
  {
    rule: required,
    msg: 'Name is required'
  },
  {
    rule (value) {
      const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return regexp.test(value)
    },
    msg: 'Name requires at least 5 letters or digits and begins with letter'
  }
]

export const email = [{
    rule: required,
    msg: 'Email address is required'
  },
  {
    rule: emailRule,
    msg: 'Invalid email address'
  }]

export const password = [{
    rule: required,
    msg: 'Password is required'
  },
  {
    rule (value) {
      const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/
      return regexp.test(value)
    },
    msg: 'Password requires at least 8 characters without spaces, one number, one lowercase, one uppercase letter and one special character'
  }]

export const confirmation = [{
    rule: required,
    msg: 'Confirmation is required'
  },
  {
    rule: sameAs('password'),
    msg: 'Password mismatch'
  }]

export const firstName = [{
    rule: required,
    msg: 'First Name is required'
  }]

export const lastName = [{
    rule: required,
    msg: 'Last Name is required'
  }]

  export const mobileNumber = [{
    rule: required,
    msg: 'Mobile number is required'
  },
  {
  rule (value) {
    const regexp = /^(?=^.{10,11}$)0\d*-?\d*$/
    return regexp.test(value)
  },
  msg: 'Please intert a correct Dutch number'
  }]

  export const name = [{
    rule: required,
    msg: 'Name is required'
  }]


  export const date = [{
    rule: required,
    msg: 'Date is required'
  }]


export const completed = [{
    rule: required
  }]

const vrules = (vdata) => {
  return vdata.reduce((acc, cur, i) => {
    acc[i] = cur.rule
    return acc
  }, {})
}

const vmsg = (validator, vdata) => {
  for (let i = 0; i < vdata.length; i++) {
    if (!validator[i]) { return vdata[i].msg }
  }
}

export default {
  vrules,
  vmsg
}