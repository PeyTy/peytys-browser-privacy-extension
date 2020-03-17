cd contentScript
:: just calls `tsc`
:: wrap it 'cause tsc kills the terminal
cmd /c tsc
cd ..
yarn build
