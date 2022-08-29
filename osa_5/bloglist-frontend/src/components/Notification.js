const Notification = ({ message }) => {
  if (message === null) {
    return null
  } else if (message.includes('wrong username')) {
    return (
      <div className="error">
        {message}
      </div>
    )
  }

  return (
    <div className="added">
      {message}
    </div>
  )
}

export default Notification