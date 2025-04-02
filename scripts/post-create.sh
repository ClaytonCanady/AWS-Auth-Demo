#!/usr/bin/env bash

USERNAME=vscode

echo -n "Setting up powerline (Powerlevel10K) ..."

git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k" &> /dev/null
sed -i 's@\(^ZSH_THEME="\).*@\1powerlevel10k/powerlevel10k"@' ~/.zshrc

ROOT_DIR=$(realpath $(dirname "$0"))
cp "${ROOT_DIR}/.p10k.zsh" ~/.p10k.zsh

echo "# To customize prompt, run 'p10k configure' or edit ~/.p10k.zsh." >> ~/.zshrc
echo -e "[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh\n" >> ~/.zshrc

echo -e " \033[32;1mDONE\033[0m"
echo -e "\033[31;1mNOTE\033[0m: Requires installation of suitable Nerdfont on host machine to display glyphs."
echo -e "see https://www.nerdfonts.com/font-downloads\n"

echo "sym link zsh_history ..."
mkdir -p /commandhistory 
touch /commandhistory/.zsh_history
chown -R $USERNAME /commandhistory

SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.zsh_history"
echo "$SNIPPET" >> "/home/$USERNAME/.zshrc"

echo "adding aws cli completion support"
echo "# support for aws cli completion" >> "/home/$USERNAME/.zshrc"
echo "autoload bashcompinit && bashcompinit" >> "/home/$USERNAME/.zshrc"
echo "autoload -Uz compinit && compinit" >> "/home/$USERNAME/.zshrc"
echo "complete -C '/usr/local/bin/aws_completer' aws"  >> "/home/$USERNAME/.zshrc"

echo "install aws-cdk ..."
npm install -g aws-cdk
