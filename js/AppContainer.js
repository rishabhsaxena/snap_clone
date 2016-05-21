import React,{ Component } from 'react';

import {	
	View,
	Text,
	PanResponder,
    Animated,
    Dimensions,
    StyleSheet,
} from 'react-native';




export default class AppContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			offset : {
				center : new Animated.Value(0),
				left : new Animated.Value(0),
				right : new Animated.Value(screenWidth),
			},
			currentView : CurrentView.Center,
		};

		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: (evt, gestureState) => {
        	return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
               && Math.abs(gestureState.dx) > 10
      		},
      		onPanResponderMove: (e, gesture) => {
      			//handle move gesture
      			this.handleMoveGesture(e,gesture);
      			  			
      		},
        	onPanResponderRelease: (e, gesture) => {
        		//hand gesture release
        		this.handleMoveGestureRelease(e,gesture);
        	}
		});
	}

	handleMoveGesture(e, gesture) {
		console.log('handleMoveGesture',this.state.currentView);
		let {center, left, right} = this.state.offset;
		switch (this.state.currentView){
      				case CurrentView.Center : 
	      				center.setValue(gesture.dx);
	      				left.setValue(gesture.dx-screenWidth);
	      				right.setValue(screenWidth+gesture.dx);
	      				break;
	      			case CurrentView.Left :
	      				center.setValue(screenWidth+gesture.dx);
	      				left.setValue(gesture.dx);
	      				break;
	      			case CurrentView.Right :
	      				center.setValue(-screenWidth+gesture.dx);
	      				right.setValue(gesture.dx);	
	      				break;
      			}    
	}

	handleMoveGestureRelease(e, gesture) {
		console.log('handleMoveGestureRelease',this.state.currentView);
		let {center, left} = this.state.offset;
		let slideCurrentView = !!(Math.abs(gesture.dx) > (screenWidth/2));
		console.log('slideCurrentView',slideCurrentView);
		switch (this.state.currentView){
        			case CurrentView.Center :
	        			slideCurrentView ? ((gesture.dx > 0) ? this.loadLeftView() :  this.loadRightView()  ) : this.loadCenterView();
	        			break;

	        		case CurrentView.Left :
	        			(slideCurrentView && gesture.dx < 0 ) ? this.loadCenterView() : this.loadLeftView();
	        			break;

	        		case CurrentView.Right : 
	        			(slideCurrentView && gesture.dx > 0 ) ? this.loadCenterView() : this.loadRightView();
	        			break;
        		}
	}

	loadLeftView() {
		let {center, left} = this.state.offset;
		Animated.spring(
			center,
			{toValue:screenWidth}
		).start();
		Animated.spring(
			left,
			{toValue:0}
		).start();
		this.setState({currentView : CurrentView.Left});
	}

	loadCenterView() {
		let {center, left, right} = this.state.offset;
		Animated.spring(
		    center,
		    {toValue:0}
		).start();
		Animated.spring(
		    left,
		    {toValue:-screenWidth}
		).start();
		Animated.spring(
		    right,
		    {toValue:screenWidth}
		).start();
		this.setState({currentView : CurrentView.Center});
	}

	loadRightView() {
		let {center, left, right} = this.state.offset;
		Animated.spring(
		    center,
		    {toValue:-screenWidth}
		).start();
		Animated.spring(
		    right,
		    {toValue:0}
		).start();
		this.setState({currentView : CurrentView.Right});
	}

	listener() {
		console.log('aaa');
	}

	render() {
		let {center, left, right} = this.state.offset;
		console.log(this.state.pulledView,"pulled view");
		return (
			<View style={styles.container}>
				<Animated.View
					style={[ styles.left, { left : left } ]}
					{...this.panResponder.panHandlers}
					> 
					<Text>left containerleft containerleft containerleft containerleft containerleft container</Text>
				</Animated.View>
				<Animated.View style={[styles.center, { left : center }]}
					{...this.panResponder.panHandlers}> 
					<Text>center</Text> 
				</Animated.View>
				<Animated.View style={[styles.right, { left : right }]}
					{...this.panResponder.panHandlers}> 
					<Text>right view right viewright viewright viewright view</Text> 
				</Animated.View>
			</View>
		);
	}
}

const CurrentView = { Center : 'center', Left : 'left', Right : 'right', Top : 'top' };
let Window = Dimensions.get('window');
let screenWidth = Dimensions.get('window').width;
let styles = StyleSheet.create({
	container: {
    flex: 1,
  },
  center: {
    flex: 1,
    backgroundColor: 'red',
  },
  left: {
    position: 'absolute',
    top:0,
    bottom:0,
    left:0,
    backgroundColor: 'blue',
    width: screenWidth,
  },
  right:{
  	position: 'absolute',
    top:0,
    bottom:0,
    left:screenWidth,
    backgroundColor: 'green',
    width: screenWidth,
  }
});

