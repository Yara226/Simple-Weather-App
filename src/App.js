import { styled } from '@mui/material/styles';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import Container from '@mui/material/Container';
import './App.css';
import Card from '@mui/material/Card';
import { useEffect } from 'react';
import axios, { all } from "axios";
import CloudIcon from '@mui/icons-material/Cloud';
import Typography from '@mui/material/Typography';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslation } from 'react-i18next';
import './App.css';
import "dayjs/locale/ar"; // اللغة العربية
const theme = createTheme({
  typography: {
   fontFamily:["face"],
   
  },
});
// to avoid memory leak we can use cancel token from axios to cancel the request when the component unmounts
let cancelTokenSource = null;

export default function TypographyTheme() {
  const[content,setContent]=React.useState("انجليزى");
 const { t, i18n } = useTranslation();

  dayjs.extend(relativeTime);
// dayjs.locale("ar");
console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'));
const [dateTime, setDateTime] = React.useState("");
 const [allData, setAllData] = React.useState({
  degree: "",
  description: "",
  bigdegree: "",
 wind: "",
 
  icon:null
});

  useEffect(()=>{
    i18n.changeLanguage("ar");
    dayjs.locale("ar");
    setDateTime(dayjs().format("dddd, DD MMMM YYYY"));
     axios
  .get("https://api.weatherapi.com/v1/current.json?key=a866e32bb3cc460da85154147262804&q=%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6", {
   cancelToken: new axios.CancelToken((cancel) => {
      // cancel the request if the component unmounts
      cancelTokenSource = cancel;
    }),
  })
  // when using use effect make sure if u wanna use cleanup(function) to avoid memory leak( بعمل مده عما يبقى فلى شاتراك من حاجه تستنوفها يعنى برجعه للستيت القديمة عشان الانموت الجيه )
  .then((response) => {
    console.log(response.data);
    const data = response.data.current;
    const Degree = Math.round(data.temp_c);
    const Description = data.condition.text;
    const BigDegree = Math.round(data.feelslike_c);
    const Wind = Math.round(data.wind_degree);
    const Icon=data.condition.icon;
   setAllData(prev => ({
  ...prev,
  degree: Degree,
  description: Description,
  bigdegree: BigDegree,
  wind: Wind,
icon:Icon
}));
    console.log(allData);

  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    console.log("Request completed");
  });
  return (()=>{
    cancelTokenSource();
  })
  
  },[])
  return (
    <ThemeProvider theme={theme}>
      
 <React.Fragment>
      <CssBaseline  />
      
      <Container maxWidth="md"  style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', 
     
      }} 
     
      >
           <Card sx={{ minWidth: 550}} style={{marginTop:'40px',padding:'20px', backgroundColor:'#f5f5f5'}}
            dir={i18n.language === "ar" ? "ltr" : "rtl"}>
            {/* all content */}
      <div>
         <div   dir={i18n.language === "ar" ? "rtl" : "ltr"}
        style={{

          display:'flex',
          flexDirection:'row',
            alignItems:'end',
        
          gap:'10px'
        }}>
          {/* title */}
          <Typography variant="h3"   >
           {t("AlReyad")}
          </Typography>
      
          {/* description */}
          <Typography variant="h8"   >
   {    dateTime}
          </Typography>
       </div>
       <hr />
       {/* container Dev */}
       <div style={{
  display:'flex',
  flexDirection:'row',
  alignItems:'end',
  justifyContent:'space-between',
  gap:'10px'
       }}>
        {/* right DEv */}
        <div>
          <CloudIcon style={{fontSize:'100px',color:'#90caf9'}} />
        </div>
        {/* left Dev */}
        <div>
          <Typography variant="h3" style={{textAlign:'end'}}   >
            {allData.degree}°C
          </Typography>
          <Typography variant="h7"   >
          <img src={allData.icon} alt="weather icon" />
          </Typography>
            {/* Degrees */}
            <div style={{
  display:'flex',
  flexDirection:'row',
  alignItems:'center',
  gap:'10px'
            }}>
              <Typography variant="h6"   >
              {allData.bigdegree}°c {t("feel")}
              </Typography>
              <h5>|</h5>
              <Typography variant="h6"   >
                {allData.wind} {t("wind")}
              </Typography>
            </div>
        </div>
       </div>

      </div>
          
    </Card>
    <button style={{marginTop:'20px',padding:'10px 20px',backgroundColor:'#90caf9',color:'white',border:'none',borderRadius:'5px',
      alignSelf:'start',
     marginLeft:'7rem',
     cursor:'pointer'
     
      
    }
    }
     
      
     onClick={()=>{
     if(content==="انجليزى"){
      i18n.changeLanguage("en");
      setContent("Arabic");
     dayjs.extend(relativeTime);
dayjs.locale("en");

     }else{
      i18n.changeLanguage("ar");
      setContent("انجليزى");
dayjs.extend(relativeTime);
dayjs.locale("ar");

     }
    setDateTime(dayjs().format("dddd, DD MMMM YYYY")); }
     
    }
    >{content}</button>  
      
      </Container>
    </React.Fragment>
      </ThemeProvider>
  );
}
