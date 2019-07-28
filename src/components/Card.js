import React, { Component } from 'react'

class Card extends Component {

  render() {
    const catagory = this.props.catagory
    const values = this.props.values
    return (
        <div>
        { typeof values !== "undefined" &&
          <div class="card shadow mx-auto border-primary mb-3">
          <div class="card-header">
            <h5 class="card-title">{catagory}</h5>
          </div>
            <div class="card-body">
              <ul>
              {values.map((item) => <li>{item}</li>
              )}
              </ul>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Card
