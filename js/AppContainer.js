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
				centerVer : new Animated.Value(0),
				top : new Animated.Value(-screenHeight),
			},
			currentView : CurrentView.Center,
			swipeType : SwipeType.Horizontal,
		};

		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: (evt, gestureState) => {
				if ( Math.abs(gestureState.dx) > 10 && (Math.abs(gestureState.dx) > Math.abs(gestureState.dy))){
					this.setState({ swipeType : SwipeType.Horizontal});
					return true;
				}
				if ( Math.abs(gestureState.dy) > 10 && (Math.abs(gestureState.dx) < Math.abs(gestureState.dy))){
					this.setState({ swipeType : SwipeType.Vertical});
					return true;
				}
	        	return false;
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
		console.log ( gesture.dy, "vertical", this.state.swipeType, 'swipetype')
		let {center, left, right, top, centerVer} = this.state.offset;
		switch (this.state.currentView){
      				case CurrentView.Center : 
	      				
	      				if ( this.state.swipeType === SwipeType.Horizontal ){
	      					center.setValue(gesture.dx);
	      					left.setValue(gesture.dx-screenWidth);
	      					right.setValue(screenWidth+gesture.dx);
	      				}
	      				if ( this.state.swipeType === SwipeType.Vertical ){
	      					top.setValue(gesture.dy-screenHeight);
	      					centerVer.setValue(gesture.dy);
	      				}
	      				break;
	      			case CurrentView.Left :
	      				if ( this.state.swipeType === SwipeType.Horizontal ){
		      				center.setValue(screenWidth+gesture.dx);
		      				left.setValue(gesture.dx);
		      			}
	      				break;
	      			case CurrentView.Right :
	      				if ( this.state.swipeType === SwipeType.Horizontal ){
		      				center.setValue(-screenWidth+gesture.dx);
		      				right.setValue(gesture.dx);	
	      				}
	      				break;
	      			case CurrentView.Top :
	      				if ( this.state.swipeType === SwipeType.Vertical ){
	      					top.setValue(gesture.dy);
	      					centerVer.setValue(screenHeight+gesture.dy);
	      				}
	      				break;
      			}    
	}

	handleMoveGestureRelease(e, gesture) {
		console.log('handleMoveGestureRelease',this.state.currentView);
		let {center, left} = this.state.offset;
		let slideCurrentView = function() {
			if ( this.state.swipeType === SwipeType.Horizontal && (Math.abs(gesture.dx) > (screenWidth/2))){
				console.log('slideCurrentView',this.state.swipeType ,Math.abs(gesture.dx),screenWidth/2);
				return true;
			}else if ( this.state.swipeType === SwipeType.Vertical && (Math.abs(gesture.dy) > (screenHeight/2))){				
				console.log('slideCurrentView_ver',this.state.swipeType ,Math.abs(gesture.dy),screenHeight/2);
				return true;
			}else {
				return false;
			}
		}.call(this); 

		console.log('slideCurrentView',slideCurrentView);
		switch (this.state.currentView){
        			case CurrentView.Center :
        				if ( this.state.swipeType === SwipeType.Horizontal  ){
	        				slideCurrentView ? ((gesture.dx > 0) ? this.loadLeftView() :  this.loadRightView()  ) : this.loadCenterView();
        				}
        				if ( this.state.swipeType === SwipeType.Vertical ){
        					(slideCurrentView && gesture.dy > 0 ) ? this.loadTopView() : this.loadCenterView();
        				}
	        			break;

	        		case CurrentView.Left :
	        			if ( this.state.swipeType === SwipeType.Horizontal  ){
	        				(slideCurrentView && gesture.dx < 0 ) ? this.loadCenterView() : this.loadLeftView();
	        			}
	        			break;

	        		case CurrentView.Right : 
	        			if ( this.state.swipeType === SwipeType.Horizontal  ){
	        				(slideCurrentView && gesture.dx > 0 ) ? this.loadCenterView() : this.loadRightView();
	        			}
	        			break;

	        		case CurrentView.Top :
	        			(slideCurrentView && gesture.dy < 0) ? this.loadCenterView() :this.loadTopView();
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
		let {center, left, right, top, centerVer} = this.state.offset;
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
		Animated.spring(
		    top,
		    {toValue:-screenHeight}
		).start();
		Animated.spring(
		    centerVer,
		    {toValue:0}
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

	loadTopView() {
		let {top, centerVer} = this.state.offset;
		Animated.spring(
		    centerVer,
		    {toValue:screenHeight}
		).start();
		Animated.spring(
		    top,
		    {toValue:0}
		).start();
		this.setState({currentView : CurrentView.Top});
	}

	listener() {
		console.log('aaa');
	}

	render() {
		let {center, left, right, top, centerVer} = this.state.offset;
		return (
			<View style={styles.container}>
				<Animated.View
					style={[ styles.left, { left : left } ]}
					{...this.panResponder.panHandlers}
					> 
					<Text>left containerleft containerleft containerleft containerleft containerleft container</Text>
				</Animated.View>
				<Animated.View style={[styles.center, { left : center, top : centerVer }]}
					{...this.panResponder.panHandlers}> 
					<Text>center</Text> 
				</Animated.View>
				<Animated.View style={[styles.right, { left : right }]}
					{...this.panResponder.panHandlers}> 
					<Text>right view right viewright viewright viewright view</Text> 
				</Animated.View>
				<Animated.View style={[styles.top, { top : top }]}
					{...this.panResponder.panHandlers}> 
					<Text>top view</Text> 
				</Animated.View>
			</View>
		);
	}
}

const CurrentView = { Center : 'center', Left : 'left', Right : 'right', Top : 'top' };
const SwipeType = { Vertical : 'vertical', Horizontal : 'horizontal' };
let Window = Dimensions.get('window');
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
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
  },
  top : {
  	position: 'absolute',
    top: -screenHeight,
    left: 0,
    right: 0,
    backgroundColor: 'cyan',
    height: screenHeight,
  }
});

