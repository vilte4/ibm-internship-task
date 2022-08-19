import { LinkItUrl } from "react-linkify-it";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
} from "@material-ui/core";
import classes from "./CompanyCard.module.css";
import buttonClasses from "./Button.module.css";

const CompanyCard = (props) => {
  return (
    <div>
      <Card
        style={{
          border: "2px solid purple",
          boxShadow: "5px 10px #ece6ff",
        }}
        className={classes.root}
      >
        <CardHeader
          title={props.companyInfo.name}
          className={buttonClasses.button}
          style={{ borderRadius: "0px" }}
          onClick={props.onClick}
        />
        <CardMedia className={classes.media}>
          <img
            className={classes.img}
            alt="product"
            src={props.companyInfo.logo}
          />
        </CardMedia>

        <CardContent>
          <Typography noWrap={true}>
            Country: {props.companyInfo.country}
          </Typography>
          <Typography noWrap={true}>
            Currency: {props.companyInfo.currency}
          </Typography>
          <LinkItUrl>{props.companyInfo.weburl}</LinkItUrl>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyCard;
