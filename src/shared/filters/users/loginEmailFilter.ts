export const loginEmailFilter = (login?: string, email?: string): {} => {
  let filter = {}

  if (login && email) {
    filter = {
      $or: [
        { login: { $regex: login, $options: 'i' } },
        { email: { $regex: email, $options: 'i' } },
      ],
    }
  } else if (login) {
    filter = { login: { $regex: login, $options: 'i' } }
  } else if (email) {
    filter = { email: { $regex: email, $options: 'i' } }
  }

  return filter
}
