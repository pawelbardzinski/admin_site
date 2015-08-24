=begin
set :application, "set your application name here"
set :repository,  "set your repository location here"

# set :scm, :git # You can set :scm explicitly or Capistrano will make an intelligent guess based on known version control directory names
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

role :web, "your web-server here"                          # Your HTTP server, Apache/etc
role :app, "your app-server here"                          # This may be the same as your `Web` server
role :db,  "your primary db-server here", :primary => true # This is where Rails migrations will run
role :db,  "your slave db-server here"
=end

# if you want to clean up old releases on each deploy uncomment this:
# after "deploy:restart", "deploy:cleanup"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end

require "rvm/capistrano" 
require "bundler/capistrano"
require 'capistrano/ext/multistage'

namespace :deploy do

set :application, 'Stafficiency.co'
set :repository, 'https://git.assembla.com/staffing-widget.web.git'
set :deploy_to, '/srv/www'
set :scm, :git
set :branch, 'develop'
set :user, 'lelanderadmin'
set :scm_passphrase, 'T3pEBG6xgR5'
set :use_sudo, false
set :rails_env, 'development'
set :deploy_via, 'copy'
set :keep_releases, 5
set :rvm_type, :system
set :stages, ['development', 'production']
set :default_stage, 'development'

=begin
set :default_environment, {
      'PATH' => "/usr/local/rvm/rubies/ruby-2.2.1/bin/:$PATH"
    }
=end

default_run_options[:pty] = true

# 52.24.114.168 for Development

	desc "restart web server"
	task :http_restart do
		run 'sudo service nginx restart'
	end

end

=begin
namespace :deploy do

	desc "migrate db"
	task :migrate do
		run "rake db:migrate"
	end

end
=end
