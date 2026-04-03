import React from 'react'


class ErrorBoundary extends React.Component{
    constructor(props){
        super(props)
        this.state={
            hasError:false
        }
    }

    static getDerivedStateFromError(error){
        return {hasError:true}
    }

    componentDidCatch(error,errorInfo){
        console.log("error caught:",error)
        console.log("error info:",errorInfo)
    }

    render(){
        if(this.state.hasError){
            return <div className='w-screen h-screen flex items-center justify-center text-4xl font-bold'>
                Something went wrong 😢
            </div>
        }
        return this.props.children
    }

}


export default ErrorBoundary