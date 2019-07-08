# techFlow Profile Collection Web Application
## Steps to use this tool
### Generate new .tprof file
1. Input the <b>name and techFlow version</b> of the profile.
2. Select / Input the values for each profile info.
3. Unchecked the unwanted profile info.
4. Submit.
<br/>


### Generate new .tprof file based on the existing .tprof/.tsv files
1. Import the .tprof / .tsv file.
2. Make a change to the profile info rendered.
3. Submit
<br/>
* If the value in .tsv file is not supported by the profile info pre-set supported value, then the profile info loaded into the form will be null and unchecked.
* If the profile info name in .tsv file is not found in the pre-set profile info list, then the profile info will be ignored.

## Add new profile info
### New profile info with input type "select-one"/"text"
1. Add the new profile info in `profileCollection.js`.

### New profile info with input type "select-multiple"
1. Add the new profile info in `profileCollection.js`. The selectedValue of the respective profile info in the `profileCollection.js` must be set to empty array `[]`.
2. Add the new profile info variable name in the <b>multiSelectedProfile</b> in the `multiSelectedValue.js` file.

### New paired profile info (with .IfParentNotFound) with input type "select-multiple"
1. Add the both new profile info in `profileCollection.js`. The selectedValue of the respective profile info in the `profileCollection.js` must be set to empty array `[]`.
2. Add the both new profile info variable name in the <b>multiSelectedProfile</b> array in the `multiSelectedValue.js` file.
3. Add the `NewProfileInfo.IfParentNotFound` variable name in the <b>multiSelectedPairedProfile</b> array in the `multiSelectedValue.js` file.


<br/><br/><br/>This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
