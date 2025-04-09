import * as React from 'react';
import {getItem as getToken} from './async-storage';

const AuthContext = React.createContext({
  status: 'idle',
  authToken: null,

  signIn: () => {},
  signOut: () => {},
});

export const useAuthorization = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('Error');
  }
  return context;
};

export const AuthProvider = props => {
  const controller = new AbortController();
  const [state, dispatch] = React.useReducer(reducer, {
    status: 'idle',
    authToken: null,
  });

  React.useEffect(() => {
    let isApiSubscribed = true;
    const initState = async () => {
      try {
        const authToken = await getToken();

        if (authToken !== null) {
          //console.log("authToken", authToken);
          dispatch({type: 'SIGN_IN', token: authToken});
        } else {
          dispatch({type: 'SIGN_OUT'});
        }
      } catch (e) {
        console.log('error', e);
      }
    };

    if (isApiSubscribed) {
      initState();
    }

    return () => {
      isApiSubscribed = false;
    };
  }, [state, dispatch]);

  //2nduseeffectfor unmountthe state
  React.useEffect(() => {
    let isApiSubscribed = true;
    const initState = async () => {
      try {
        const authToken = await getToken();

        if (authToken !== null) {
          dispatch({type: 'SIGN_IN', token: authToken});
        } else {
          dispatch({type: 'SIGN_OUT'});
        }
      } catch (e) {
        console.log(e);
      }
    };

    if (isApiSubscribed) {
      initState();
    }

    return () => {
      isApiSubscribed = false;
      controller.abort();
    };
  }, []);

  const actions = React.useMemo(
    () => ({
      signIn: async token => {
        dispatch({type: 'SIGN_IN', token});
      },
      signOut: async () => {
        dispatch({type: 'SIGN_OUT'});
      },
    }),
    [state, dispatch],
  );

  return (
    <AuthContext.Provider value={{...state, ...actions}}>
      {props.children}
    </AuthContext.Provider>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_OUT':
      return {
        ...state,
        status: 'signOut',
        authToken: null,
      };
    case 'SIGN_IN':
      return {
        ...state,
        status: 'signIn',
        authToken: action.token,
      };
  }
};
