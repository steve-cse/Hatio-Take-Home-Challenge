import React from 'react'
import NavigationBar from '../components/NavigationBar';
function About() {
  return (
    <>
      <NavigationBar />
      <div className="container mt-4">
      <h3 className='fw-bold'>Instructions</h3>
        <ol className='fs-5'>
          <li>To add a project type your project name into the textfield at the home page and click on the "Add Project" button. </li>
          <li>Open a project by clicking on it.</li>
          <li>In the todo page enter a todo by typing it in the text box and clicking on "Add Todo" button.</li>
          <li>Modify the project title by clicking on the edit icon next to it.</li>
          <li>Execute todo actions by clicking on the corresponding buttons.</li>
          <li>To save todos as a gist file click on the "Save as Gist" button.</li>

        </ol>
        <h3 className='fw-bold' >Technologies Used</h3>
        <ul  className='fs-5'>
          <li>React JS</li>
          <li>React Bootstrap</li>
          <li>Supabase</li>
        </ul>
        <div className='text-center fs-6' style={{marginTop:"200px"}}>Developed by Steve Boby George</div>
      </div>


    </>
  )
}

export default About