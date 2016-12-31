
import React from 'react';

class VerticalScrollbar extends React.Component {

  constructor() {
    super();
    this.state = {
      height: 0,
      dragging: false,
      start: 0
    }
  }

  render(){

    let { height, dragging } = this.state
    let { draggingFromParent, scrolling } = this.props

    if(height < 100) return(
      <div
        className="react-scrollbar__scrollbar-vertical"
        ref="container"
        onClick={ this.jump.bind(this) }>

        <div
          className={ "scrollbar" + ( dragging || draggingFromParent ? '' : ' react-scrollbar-transition') }
          ref="scrollbar"
          onTouchStart={ this.startDrag.bind(this) }
          onMouseDown={ this.startDrag.bind(this) }
          style={{
            height: height+'%',
            top: scrolling + '%'
          }} />

      </div>
    )

    else return null
  }


  startDrag(e){

    e.preventDefault()
    e.stopPropagation()

    e = e.changedTouches ? e.changedTouches[0] : e

    // Prepare to drag
    this.setState({
      dragging: true,
      start: e.clientY
    })
  }

  onDrag(e){

    if(this.state.dragging){

      // Make The Parent being in the Dragging State
      this.props.onDragging()

      e.preventDefault()
      e.stopPropagation()

      e = e.changedTouches ? e.changedTouches[0] : e

      let yMovement = e.clientY - this.state.start
      let yMovementPercentage = yMovement / this.props.wrapper.height * 100

      // Update the last e.clientY
      this.setState({ start: e.clientY }, () => {

        // The next Vertical Value will be
        let next = this.props.scrolling + yMovementPercentage

        // Tell the parent to change the position
        this.props.onChangePosition(next, 'vertical')
      })



    }

  }

  stopDrag(e){
    if(this.state.dragging){
      // Parent Should Change the Dragging State
      this.props.onStopDrag()
      this.setState({ dragging: false })
    }
  }

  jump(e){

    let isContainer = e.target === this.refs.container

    if(isContainer){

      // Get the Element Position
      let position = this.refs.scrollbar.getBoundingClientRect()

      // Calculate the vertical Movement
      let yMovement = e.clientY - position.top
      let centerize = (this.state.height / 2)
      let yMovementPercentage = yMovement / this.props.wrapper.height * 100 - centerize

      // Update the last e.clientY
      this.setState({ start: e.clientY }, () => {

        // The next Vertical Value will be
        let next = this.props.scrolling + yMovementPercentage

        // Tell the parent to change the position
        this.props.onChangePosition(next, 'vertical')

      })

    }
  }

  calculateSize(source){
    // Scrollbar Width
    this.setState({ height: source.wrapper.height / source.area.height * 100 })
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.wrapper.height !== this.props.wrapper.height ||
        nextProps.area.height !== this.props.area.height ) this.calculateSize(nextProps)
  }

  getSize(){
    // The Elements
    let $scrollArea = this.refs.container.parentElement
    let $scrollWrapper = $scrollArea.parentElement

    // Get new Elements Size
    let elementSize = {
      // Scroll Area Height and Width
      scrollAreaHeight: $scrollArea.children[0].clientHeight,
      scrollAreaWidth: $scrollArea.children[0].clientWidth,

      // Scroll Wrapper Height and Width
      scrollWrapperHeight: $scrollWrapper.clientHeight,
      scrollWrapperWidth: $scrollWrapper.clientWidth,
    }
    return elementSize
  }

  componentDidMount() {
    this.calculateSize(this.props)

    // Put the Listener
    document.addEventListener("mousemove", this.onDrag.bind(this))
    document.addEventListener("touchmove", this.onDrag.bind(this))
    document.addEventListener("mouseup", this.stopDrag.bind(this))
    document.addEventListener("touchend", this.stopDrag.bind(this))
  }

  componentWillUnmount() {
    // Remove the Listener
    document.removeEventListener("mousemove", this.onDrag.bind(this))
    document.removeEventListener("touchmove", this.onDrag.bind(this))
    document.removeEventListener("mouseup", this.stopDrag.bind(this))
    document.removeEventListener("touchend", this.stopDrag.bind(this))
  }

}


// The Props
VerticalScrollbar.propTypes = {
  draggingFromParent: React.PropTypes.bool.isRequired,
  scrolling: React.PropTypes.number.isRequired,
  wrapper: React.PropTypes.object.isRequired,
  area: React.PropTypes.object.isRequired,
  onChangePosition: React.PropTypes.function.isRequired,
  onDragging: React.PropTypes.function.isRequired,
  onStopDrag: React.PropTypes.function.isRequired
}

export default VerticalScrollbar;
