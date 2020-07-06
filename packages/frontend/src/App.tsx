import React from "react";
import { HashRouter as Router, Switch, Route, Redirect, NavLink } from "react-router-dom";
import {
  ThemeProvider,
  Box,
  Flex,
  Heading,
  Card,
  Text,
  Button,
  Label,
  Input,
  IconButton
} from "theme-ui";

import theme from "./theme";
import {
  displayOnMobile,
  displayOnNonMobile,
  displayOnWide,
  displayOnNonWide
} from "./utils/breakpoints";
import { Icon } from "./components/Icon";
import { NavBar } from "./components/NavBar";
import { AccessibleLiquityLogo } from "./components/AccessibleLiquityLogo";

const LiquityFrontend: React.FC = () => {
  return (
    <Flex
      sx={{
        flexDirection: "column",

        position: "relative",
        width: "100%",
        minHeight: "100%"
      }}
    >
      <Flex
        as="header"
        sx={{
          position: "relative",
          zIndex: 1,

          p: [5, 7],
          fontSize: "38px"
        }}
      >
        <AccessibleLiquityLogo />

        <Heading
          variant="caps"
          sx={{
            position: ["absolute", "unset"],
            top: "100%",

            ml: [0, "0.75em"],
            fontSize: "0.5em",
            lineHeight: 2.2
          }}
        >
          <Switch>
            <Route path="/borrow">My Trove</Route>
            <Route path="/grow">My Stability Deposit</Route>
            <Route path="/redeem">Redeem</Route>
          </Switch>
        </Heading>
      </Flex>

      <Flex sx={{ flexGrow: 1 }}>
        <Flex sx={{ flexDirection: "column", zIndex: 1 }}>
          <NavBar
            sx={{
              flexGrow: 1,

              position: ["absolute", "unset"],
              top: 5,
              left: 8,
              right: 8,

              mx: 7
            }}
          >
            <NavLink to="/borrow">
              <Icon name="hands-helping" />
              Borrow
            </NavLink>

            <NavLink to="/grow">
              <Icon name="seedling" />
              Grow
            </NavLink>

            <NavLink to="/redeem">
              <Icon name="retweet" />
              Redeem
            </NavLink>
          </NavBar>

          <Box
            as="footer"
            sx={{
              ...displayOnNonMobile,
              p: 7,
              whiteSpace: "nowrap"
            }}
          >
            © Liquity.org | 2020
          </Box>
        </Flex>

        <Box sx={{ flexGrow: 1, minHeight: ["440px", "560px"] }}>
          <Flex
            sx={{
              alignItems: "center",
              justifyContent: "center",

              position: ["unset", "absolute"],
              top: 0,
              left: 0,
              width: "100%",
              height: "100%"
            }}
          >
            <Box
              as="main"
              sx={{
                height: ["100%", "470px"],
                width: ["100%", "500px"],
                mr: [0, null, null, "320px"],
                ml: [0, "220px", null, "320px"],
                p: 5
              }}
            >
              <Switch>
                <Route exact path="/">
                  <Redirect to="/borrow" />
                </Route>

                <Route path="/borrow">
                  <Flex
                    as="form"
                    sx={{
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: ["stretch", "center"],

                      position: "relative",
                      zIndex: 0,
                      height: "100%",

                      "::before": {
                        ...displayOnMobile,
                        content: '""'
                      }
                    }}
                  >
                    <Flex
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",

                        position: "absolute",
                        zIndex: -1,
                        top: ["12%", 0],
                        width: "100%",
                        height: ["88%", "100%"],

                        color: "muted",
                        opacity: 0.5
                      }}
                    >
                      <Icon name="lock" size="10x" />
                    </Flex>

                    <Flex
                      sx={{
                        justifyContent: "space-around",
                        width: "100%",
                        fontSize: [0, 1]
                      }}
                    >
                      <Flex sx={{ alignItems: "center" }}>
                        <Icon name="percent" size="lg" />
                        <Box sx={{ ml: [3, 5] }}>
                          <Text>Collateral ratio</Text>
                          <Text sx={{ fontSize: 3, fontWeight: "medium", color: "success" }}>
                            202.0%
                          </Text>
                        </Box>
                      </Flex>

                      <Flex sx={{ alignItems: "center" }}>
                        <Icon name="exclamation-circle" size="2x" />
                        <Box sx={{ ml: [3, 5] }}>
                          <Text>Liquidation price</Text>
                          <Text sx={{ fontSize: 3, fontWeight: "medium" }}>$87.74</Text>
                        </Box>
                      </Flex>
                    </Flex>

                    <Box sx={{ position: "relative" }}>
                      <Label htmlFor="trove-collateral" sx={{ position: "absolute", top: "-1.5em" }}>
                        Collateral
                      </Label>

                      <Flex>
                        <Input
                          id="trove-collateral"
                          aria-describedby="trove-collateral-unit"
                          value="12.5390"
                          disabled
                        />
                        <Flex id="trove-collateral-unit" variant="forms.unit">
                          ETH
                          <IconButton aria-label="Change currency" sx={{ fontSize: 2 }}>
                            <Icon name="retweet" />
                          </IconButton>
                        </Flex>
                      </Flex>
                    </Box>

                    <Box sx={{ position: "relative" }}>
                      <Label htmlFor="trove-debt" sx={{ position: "absolute", top: "-1.5em" }}>
                        Outstanding debt
                      </Label>

                      <Flex>
                        <Input
                          id="trove-debt"
                          aria-describedby="trove-debt-unit"
                          value="1000.00"
                          disabled
                        />
                        <Box id="trove-debt-unit" variant="forms.unit">
                          LQTY
                        </Box>
                      </Flex>
                    </Box>

                    <Button>
                      <Icon name="unlock" />
                      Make changes
                    </Button>
                  </Flex>
                </Route>
              </Switch>
            </Box>
          </Flex>
        </Box>

        <Box
          as="aside"
          sx={{
            ...displayOnNonWide,

            position: "absolute",
            zIndex: 1,
            right: 4,
            top: 4
          }}
        >
          <IconButton variant="cardlike" sx={{ p: 0 }}>
            <Icon name="info" size="xs" aria-label="More information" aria-hidden={false} />
          </IconButton>
        </Box>

        <Box
          as="aside"
          sx={{
            ...displayOnWide,

            position: "absolute",
            zIndex: 1,
            top: 0,
            right: 0,

            m: 7
          }}
        >
          <Flex
            sx={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              width: "360px"
            }}
          >
            <Button variant="cardlike">
              <Icon name="user-circle" aria-label="Connected user" aria-hidden={false} />
              <Text sx={{ mx: 3 }}>0x70E...DDF</Text>
              <Icon name="caret-down" />
            </Button>

            <Flex
              sx={{
                alignItems: "center",
                fontSize: 3,
                lineHeight: 1.1
              }}
            >
              <Icon name="wallet" size="lg" aria-label="Wallet balance" aria-hidden={false} />

              <Text
                sx={{ ml: 5, my: -5, fontSize: "0.9em", fontFamily: "heading", fontWeight: "body" }}
              >
                <div>10.4527 ETH</div>
                <div>278.10 LQTY</div>
              </Text>
            </Flex>
          </Flex>

          <Box sx={{ position: "absolute", right: 0 }}>
            <Card sx={{ mt: 8 }}>
              <Heading>Liquity System</Heading>

              <table>
                <tbody>
                  {[
                    ["Total collateral ratio:", "311%"],
                    ["Total LQTY supply:", "7.48M"],
                    ["LQTY in Stability Pool:", "1.35M"],
                    ["% of LQTY in Stability Pool:", "18%"],
                    ["Number of Troves:", "3421"]
                  ].map(([c1, c2], i) => (
                    <tr key={i}>
                      <td>{c1}</td>
                      <td style={{ textAlign: "right" }}>{c2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card sx={{ mt: 8, ml: 7 }}>
              <Heading>Price Feeds</Heading>

              <table style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td>ETH:</td>
                    <td style={{ textAlign: "right" }}>$161.13</td>
                  </tr>
                  <tr>
                    <td>LQTY:</td>
                    <td style={{ textAlign: "right" }}>$1.01</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <LiquityFrontend />
      </Router>
    </ThemeProvider>
  );
};

export default App;
