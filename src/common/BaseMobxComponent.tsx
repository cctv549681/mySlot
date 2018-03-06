import * as React from 'react';
import {action, observable, toJS} from 'mobx';
import {observer} from 'mobx-react';
import assign from 'object-assign';

@observer 
export default class BaseComponent<P, S> extends React.Component<P, S> {

    @observable public _state: S;

    @action
    public changeState(state: S, callback?: () => void): S {
        this._state = assign({}, toJS(this._state), state);
        if (typeof callback === 'function') {
            callback.call(this);
        }
        return this._state;
    }
}
