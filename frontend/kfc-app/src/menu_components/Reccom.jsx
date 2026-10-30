import api from '../utils/api';
import React, { useEffect, useState } from 'react'
import styles from "./item.module.css"
import { formatPrice } from '../utils/currency'



const Reccom = () => {
    let [recom,setrecom]= useState([]);
    useEffect(()=>{
      api.get("/api/searchapi/item", { params: { search: "classic" } })
      .then(({data})=>{
        setrecom(data);
      })
    },[])

  return (
    <div>
      <h2 className={styles.reccomtitle} >Reccomended Meals</h2> 
     {recom.map((el,index)=>{
      return <div key={index} className={styles.recombox} >
              <div><img src={el.image} alt="" /></div>
               <div>
                <h3>{el.title}</h3>
                <p>{el.desc}</p>
                <h3>{formatPrice(el.price)}</h3>
              </div>
            </div>
       
     })}
       

    </div>
  )
}

export default Reccom