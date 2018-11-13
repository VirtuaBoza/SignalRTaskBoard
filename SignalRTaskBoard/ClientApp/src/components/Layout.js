import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

const Layout = props => {
  return (
    <div>
      <CssBaseline />
      {props.children}
    </div>
  );
};

export default Layout;
