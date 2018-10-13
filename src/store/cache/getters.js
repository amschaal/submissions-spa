export const validators = (state) => {
  return state.validators
}
export const validatorDict = (state) => {
  var validators = {}
  for (var i in state.validators) {
    validators[state.validators[i].id] = state.validators[i]
  }
  return validators
}
export const types = (state) => {
  return state.types
}
export const typesDict = (state) => {
  var types = {}
  for (var i in state.types) {
    types[state.types[i].id] = state.types[i]
  }
  return types
}
export const typeOptions = (state) => {
  console.log('typeOptions', state)
  return state.types.map(opt => ({label: opt.name, value: opt.id}))
}
