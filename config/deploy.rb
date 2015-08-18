require "rvm/capistrano"
require "bundler/capistrano"

namespace :deploy do

set :application, 'Stafficiency.co'
set :repository, 'git@git.assembla.com:staffing-widget.web.git'
set :deploy_to, '/srv/www'
set :scm, :git
set :branch, 'develop'
set :user, 'lelanderadmin'
set :scm_passphrase, 'DyagCnytazywt22'
set :use_sudo, false
set :rails_env, 'development'
set :deploy_via, 'copy'
set :keep_releases, 5
set :rvm_type, :system
=begin
set :default_environment, {
      'PATH' => "/usr/local/rvm/rubies/ruby-2.2.1/bin/:$PATH"
    }
=end

default_run_options[:pty] = true

# 52.24.114.168 for Development
server 'stafficiency.co', :app, :web, :db, :primary => true


    desc "restart web server"
    task :http_restart do
        run 'service nginx restart'
    end

end