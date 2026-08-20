import { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";


function RecruiterApplications(){

    const [applications,setApplications] = useState([]);

    const [jobs,setJobs] = useState({});

    const navigate = useNavigate();



    useEffect(()=>{

        const recruiter = JSON.parse(localStorage.getItem("user"));


        if(recruiter){

            api
            .get(`/applications/recruiter/${recruiter.id}`)
            .then((res)=>{


                setApplications(res.data);



                // Fetch Job Names

                res.data.forEach((app)=>{


                    api
                    .get(`/jobs/${app.jobId}`)
                    .then((jobRes)=>{


                        setJobs(prev=>({

                            ...prev,

                            [app.jobId]: jobRes.data.jobTitle

                        }));


                    })
                    .catch((err)=>{

                        console.log(err);

                    });


                });



            })
            .catch((err)=>{

                console.log(err);

            });

        }


    },[]);






    const updateStatus = (id,status)=>{


        api
        .put(`/applications/update-status/${id}?status=${status}`)
        .then(()=>{


            alert("Status Updated");


            window.location.reload();


        })
        .catch((err)=>{

            console.log(err);

        });


    };






    return(


        <div style={{padding:"30px"}}>



            <h1 style={{textAlign:"center"}}>
                👥 Candidate Applications
            </h1>





            <table

            style={{

                width:"100%",

                marginTop:"30px",

                borderCollapse:"collapse",

                background:"#fff"

            }}

            >



            <thead>


            <tr

            style={{

                background:"#1976d2",

                color:"white"

            }}

            >


                <th style={th}>Name</th>

                <th style={th}>Email</th>

                <th style={th}>Phone</th>

                <th style={th}>Job Name</th>

                <th style={th}>Profile</th>

                <th style={th}>Status</th>

                <th style={th}>Action</th>


            </tr>


            </thead>





            <tbody>



            {

                applications.map((app)=>(


                    <tr key={app.id}>


                        <td style={td}>
                            {app.applicantName}
                        </td>



                        <td style={td}>
                            {app.email}
                        </td>



                        <td style={td}>
                            {app.phone}
                        </td>




                        <td style={td}>

                            {
                                jobs[app.jobId] || "Loading..."
                            }

                        </td>





                        <td style={td}>


                            <button

                            style={{

                                background:"#1976d2",

                                color:"white",

                                border:"none",

                                padding:"8px 15px",

                                borderRadius:"5px",

                                cursor:"pointer"

                            }}


                            onClick={()=>navigate(`/user-profile/${app.userId}`)}

                            >

                                View Profile

                            </button>


                        </td>







                        <td style={td}>


                            <b>

                              {app.status}

                            </b>


                        </td>






                        <td style={td}>


                            <select


                            value={app.status}


                            onChange={(e)=>

                                updateStatus(

                                    app.id,

                                    e.target.value

                                )

                            }


                            >


                                <option>
                                    Applied
                                </option>


                                <option>
                                    Shortlisted
                                </option>


                                <option>
                                    Interview Scheduled
                                </option>


                                <option>
                                    Selected
                                </option>


                                <option>
                                    Rejected
                                </option>


                            </select>


                        </td>



                    </tr>


                ))

            }



            </tbody>



            </table>



        </div>


    );

}





const th={

    padding:"12px",

    border:"1px solid #ddd"

};





const td={

    padding:"12px",

    border:"1px solid #ddd",

    textAlign:"center"

};





export default RecruiterApplications;