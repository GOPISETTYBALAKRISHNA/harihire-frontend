import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


function UserProfileView() {

    const { id } = useParams();

    const [user, setUser] = useState(null);



    useEffect(() => {

        axios
        .get(`https://harihire-production.up.railway.app/users/profile/${id}`)
        .then((res) => {

            setUser(res.data);

        })
        .catch((err) => {

            console.log(err);

        });


    }, [id]);



    if (!user) {

        return (

            <h2 style={{textAlign:"center"}}>
                Loading Profile...
            </h2>

        );

    }



    return (


        <div style={{padding:"30px"}}>


            <h1 style={{textAlign:"center"}}>
                👤 Candidate Profile
            </h1>



            <div

            style={{

                width:"450px",

                margin:"30px auto",

                padding:"25px",

                borderRadius:"15px",

                boxShadow:"0 0 15px gray",

                background:"#fff"

            }}

            >



                <h2 style={{textAlign:"center"}}>
                    {user.fullName}
                </h2>



                {
                    user.profileImage &&

                    <div style={{textAlign:"center"}}>

                        <img

                        src={user.profileImage}

                        alt="Profile"

                        style={{

                            width:"120px",

                            height:"120px",

                            borderRadius:"50%",

                            objectFit:"cover"

                        }}

                        />

                    </div>

                }



                <hr/>



                <p>
                    📧 <b>Email:</b> {user.email}
                </p>


                <p>
                    📱 <b>Phone:</b> {user.phone}
                </p>


                <p>
                    🏠 <b>Address:</b> {user.address}
                </p>


                <p>
                    🌆 <b>City:</b> {user.city}
                </p>


                <p>
                    🎓 <b>Education:</b> {user.education}
                </p>


                <p>
                    💻 <b>Skills:</b> {user.skills}
                </p>


                <p>
                    💼 <b>Experience:</b> {user.experience}
                </p>


                <p>
                    📝 <b>About:</b>
                </p>


                <p>
                    {user.about}
                </p>




                {
                    user.resume &&

                    <div style={{textAlign:"center",marginTop:"20px"}}>


                        <a

                        href={user.resume}

                        target="_blank"

                        rel="noreferrer"

                        style={{

                            background:"#1976d2",

                            color:"white",

                            padding:"10px 20px",

                            borderRadius:"5px",

                            textDecoration:"none"

                        }}

                        >

                        📄 View Resume

                        </a>


                    </div>

                }



            </div>



        </div>


    );

}


export default UserProfileView;